from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# This lets the browser access files in your 'static' folder
app.mount("/static", StaticFiles(directory="static"), name="static")

# 1. Setup Templates 
# This tells FastAPI where to find your index.html
templates = Jinja2Templates(directory="templates")

# 2. The Main Route
# When you go to http://127.0.0.1:8000, this function runs
@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    # Use context= as a keyword argument
    return templates.TemplateResponse(
        request=request, name="index.html", context={}
    )

# 3. The Save Bill Route
# This receives the bill text from the browser and writes it to Bill.txt
@app.post("/save_bill")
async def save_bill(bill_text: str = Form(...)):
    try:
        # Replicating your 'a+' file logic from caketry.py
        with open("Bill.txt", "a+") as file:
            file.write(bill_text)
            file.write("\n" + "="*40 + "\n") # Separator between bills
        
        return JSONResponse(content={"message": "Bill saved successfully to Bill.txt"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": f"Error saving bill: {str(e)}"}, status_code=500)

# Optional: If you want to use the MySQL logic you had commented out:

@app.post("/db_save")
async def db_save(name: str, phone: str, bill_no: int, total: float):
    import mysql.connector
    con = mysql.connector.connect(host='localhost', user='root', password='yourpassword', database='project')
    cur = con.cursor()
    query = "INSERT INTO info(Name, Phone, bill_no, total) values(%s, %s, %s, %s)"
    cur.execute(query, (name, phone, bill_no, total))
    con.commit()
    con.close()
