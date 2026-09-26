from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import get_db
from app import models, schemas
from app.core.websockets import manager
from app.core import deps

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("/", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        status=order.status
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    total_amount = 0.0
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time_of_order=item.price_at_time_of_order
        )
        db.add(db_item)
        total_amount += (item.quantity * item.price_at_time_of_order)
    
    # add tax
    total_amount = total_amount * 1.18
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)

    # Broadcast new order to WebSockets
    order_data = {
        "id": db_order.id,
        "customer_name": db_order.customer_name,
        "customer_phone": db_order.customer_phone,
        "total_amount": db_order.total_amount,
        "status": db_order.status
    }
    background_tasks.add_task(manager.broadcast, json.dumps({"type": "NEW_ORDER", "order": order_data}))

    return db_order

@router.patch("/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db_order.status = status
    db.commit()
    db.refresh(db_order)

    background_tasks.add_task(manager.broadcast, json.dumps({
        "type": "UPDATE_ORDER", 
        "order": {"id": db_order.id, "status": db_order.status}
    }))
    
    return db_order
