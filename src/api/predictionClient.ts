export interface PredictionData {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

export async function predictPrice(data: PredictionData) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed.");
  }

  return response.json();
}
