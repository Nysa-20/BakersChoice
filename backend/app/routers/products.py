from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app import models, schemas
from app.core import deps

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/categories", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=List[schemas.Item])
def get_products(category_id: UUID = None, db: Session = Depends(get_db)):
    query = db.query(models.Item)
    if category_id:
        query = query.filter(models.Item.category_id == category_id)
    return query.all()

@router.post("/", response_model=schemas.Item, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ItemCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_product = models.Item(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=schemas.Item)
def update_product(product_id: UUID, product: schemas.ItemUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_product = db.query(models.Item).filter(models.Item.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}/stock", response_model=schemas.Item)
def update_stock(product_id: UUID, change_amount: int, reason: models.AuditReasonEnum, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_product = db.query(models.Item).filter(models.Item.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db_product.stock_quantity += change_amount
    
    # Audit log
    audit_log = models.StockAuditLog(
        item_id=db_product.id,
        change_amount=change_amount,
        reason=reason,
        changed_by=current_admin.id
    )
    db.add(audit_log)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: UUID, db: Session = Depends(get_db), current_admin: models.User = Depends(deps.get_current_admin_user)):
    db_product = db.query(models.Item).filter(models.Item.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None
