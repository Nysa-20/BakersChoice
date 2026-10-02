from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# --- Enums Mapping ---
# Pydantic will use these strings. We don't strictly need the python Enums 
# in schemas if we type hint as strings, but it's cleaner.
from app.models import RoleEnum, ItemStatusEnum, OrderStatusEnum, LedgerTypeEnum, AuditReasonEnum

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category_id: Optional[UUID] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: UUID

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    role: RoleEnum
    points_balance: int
    created_at: datetime
    # Legacy support
    username: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Item (Product) Schemas ---
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: Optional[UUID] = None
    image_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    stock_quantity: int = 0
    low_stock_threshold: int = 10
    status: ItemStatusEnum = ItemStatusEnum.active

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[UUID] = None
    image_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    status: Optional[ItemStatusEnum] = None

class Item(ItemBase):
    id: UUID
    category: Optional[Category] = None
    
    # Legacy
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

# Alias for backwards compatibility with some routes if they still import Product
Product = Item
ProductCreate = ItemCreate

# --- Cart Schemas ---
class CartItemBase(BaseModel):
    item_id: UUID
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: UUID
    cart_id: UUID
    item: Optional[Item] = None
    
    class Config:
        from_attributes = True

class Cart(BaseModel):
    id: UUID
    user_id: UUID
    created_at: datetime
    items: List[CartItem] = []
    
    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemBase(BaseModel):
    item_id: UUID
    quantity: int
    
class OrderItemCreate(OrderItemBase):
    # During checkout, we might just pass item_id and quantity
    pass

class OrderItem(OrderItemBase):
    id: UUID
    order_id: UUID
    item_name_snapshot: str
    unit_price_at_purchase: float
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    status: OrderStatusEnum = OrderStatusEnum.pending
    subtotal: float
    tax: float
    points_discount: float
    total: float
    payment_reference_id: Optional[str] = None

class OrderCreate(BaseModel):
    # What the client sends to create an order
    points_to_redeem: int = 0
    items: List[OrderItemCreate]
    
    # Legacy support
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None

class Order(OrderBase):
    id: UUID
    user_id: Optional[UUID] = None
    created_at: datetime
    invoice_file_path: Optional[str] = None
    items: List[OrderItem] = []
    
    # Legacy
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None

    class Config:
        from_attributes = True
