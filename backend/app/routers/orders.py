from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import json
import os

from app.database import get_db
from app import models, schemas
from app.core.websockets import manager
from app.core import deps

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("/", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

@router.get("/my-orders", response_model=List[schemas.Order])
def get_my_orders(current_user: models.User = Depends(deps.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).order_by(models.Order.created_at.desc()).all()

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_user_optional)):
    
    # Validation & calculation
    subtotal = 0.0
    items_to_add = []
    
    for item_data in order.items:
        db_item = db.query(models.Item).filter(models.Item.id == item_data.item_id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail=f"Item {item_data.item_id} not found")
        
        # Atomically check and update stock
        updated = db.query(models.Item).filter(
            models.Item.id == db_item.id,
            models.Item.stock_quantity >= item_data.quantity
        ).update({models.Item.stock_quantity: models.Item.stock_quantity - item_data.quantity})
        
        if not updated:
            db.rollback() # Release any locks
            raise HTTPException(status_code=400, detail=f"Item {db_item.name} is out of stock or insufficient quantity")

        line_total = db_item.price * item_data.quantity
        subtotal += line_total
        
        items_to_add.append({
            "item_id": db_item.id,
            "item_name_snapshot": db_item.name,
            "unit_price_at_purchase": db_item.price,
            "quantity": item_data.quantity
        })
        
        # Log stock change
        audit = models.StockAuditLog(
            item_id=db_item.id,
            change_amount=-item_data.quantity,
            reason=models.AuditReasonEnum.order,
            changed_by=current_user.id if current_user else None
        )
        db.add(audit)

    tax = subtotal * 0.18 # Example 18% tax
    
    # Points logic
    points_discount = 0.0
    if current_user and order.points_to_redeem > 0:
        if current_user.points_balance < order.points_to_redeem:
            db.rollback()
            raise HTTPException(status_code=400, detail="Insufficient points balance")
        
        # Example conversion: 1 point = 1 unit of currency (adjust based on config)
        points_discount = float(order.points_to_redeem)
        # Cap redemption to 50% of subtotal
        if points_discount > (subtotal * 0.5):
            db.rollback()
            raise HTTPException(status_code=400, detail="Cannot redeem points for more than 50% of order value")

    total = subtotal + tax - points_discount
    
    db_order = models.Order(
        customer_name=order.customer_name if not current_user else current_user.name,
        customer_phone=order.customer_phone if not current_user else current_user.phone,
        status=models.OrderStatusEnum.pending,
        user_id=current_user.id if current_user else None,
        subtotal=subtotal,
        tax=tax,
        points_discount=points_discount,
        total=total
    )
    db.add(db_order)
    db.flush() # Flush to get db_order.id
    
    for item_data in items_to_add:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            **item_data
        )
        db.add(db_order_item)

    # Process points ledger
    if current_user:
        if order.points_to_redeem > 0:
            current_user.points_balance -= order.points_to_redeem
            ledger_redeem = models.PointsLedger(
                user_id=current_user.id,
                order_id=db_order.id,
                type=models.LedgerTypeEnum.redeem,
                points=-order.points_to_redeem
            )
            db.add(ledger_redeem)

        points_earned = int(total // 100) # Earn 1 point per 100 spent
        if points_earned > 0:
            current_user.points_balance += points_earned
            ledger_earn = models.PointsLedger(
                user_id=current_user.id,
                order_id=db_order.id,
                type=models.LedgerTypeEnum.earn,
                points=points_earned
            )
            db.add(ledger_earn)

    db.commit()
    db.refresh(db_order)

    # Broadcast new order to WebSockets
    order_data = {
        "id": str(db_order.id),
        "customer_name": db_order.customer_name,
        "total": db_order.total,
        "status": db_order.status.value if hasattr(db_order.status, 'value') else db_order.status
    }
    background_tasks.add_task(manager.broadcast, json.dumps({"type": "NEW_ORDER", "order": order_data}))

    return db_order

@router.patch("/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: UUID, status: models.OrderStatusEnum, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_order.status = status
    db.commit()
    db.refresh(db_order)

    background_tasks.add_task(manager.broadcast, json.dumps({
        "type": "UPDATE_ORDER", 
        "order": {"id": str(db_order.id), "status": db_order.status.value if hasattr(db_order.status, 'value') else db_order.status}
    }))
    
    return db_order
