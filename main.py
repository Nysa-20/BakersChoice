from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

from app.routers import products, orders, auth, ws

app = FastAPI(title="BakersChoice API")

# This lets the browser access files in your 'static' folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# 1. Setup Templates 
# This tells FastAPI where to find your index.html
templates = Jinja2Templates(directory="templates")

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(ws.router)

# 2. The Main Route
# When you go to http://127.0.0.1:8000, this function runs
@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={}
    )

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request):
    return templates.TemplateResponse(
        request=request, name="admin.html", context={}
    )

# 3. The Save Bill Route (Legacy support)
# We keep this just in case, but new frontend will use /api/orders
@app.post("/save_bill")
async def save_bill(bill_text: str = Form(...)):
    try:
        with open("Bill.txt", "a+") as file:
            file.write(bill_text)
            file.write("\n" + "="*40 + "\n") # Separator between bills
        return JSONResponse(content={"message": "Bill saved successfully to Bill.txt"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": f"Error saving bill: {str(e)}"}, status_code=500)
