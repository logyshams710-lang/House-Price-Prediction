
#1 Load the model once at startup

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    model = joblib.load("house_price.pkl")
    yield


app = FastAPI(lifespan=lifespan)


#2 Request schema

class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float
    floor_num: int
    bathroom: int
    balcony: int
    furnishing: str
    transaction: str
    ownership: str
    facing: str


#6 Enable CORS

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#8 Health check endpoint

@app.get("/health")
def health_check():
    return {"status": "ok"}


#4 Implement /predict endpoint

@app.post("/predict")
def predict_price(data: PredictionRequest):

    #3 Build a one-row DataFrame
    input_df = pd.DataFrame([{
        "Area_numeric": data.carpet_area_sqft,
        "Floor_numeric": data.floor_num,
        "Bathroom": data.bathroom,
        "Balcony": data.balcony,
        "Car Parking": None,
        "location_grouped": data.location,
        "Furnishing": data.furnishing,
        "Transaction": data.transaction,
        "Ownership": data.ownership,
        "facing": data.facing
    }])

    prediction = model.predict(input_df)

    return {"predicted_price": float(prediction[0])}
