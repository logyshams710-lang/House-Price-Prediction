import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice } from "../api/predictionClient";

function PredictionForm() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [floorNum, setFloorNum] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [balcony, setBalcony] = useState("");
  const [furnishing, setFurnishing] = useState("");
  const [transaction, setTransaction] = useState("");
  const [ownership, setOwnership] = useState("");
  const [facing, setFacing] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!location || !furnishing || !transaction || !ownership || !facing) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!carpetArea || Number(carpetArea) <= 0) {
      setError("Carpet area must be greater than 0.");
      return;
    }

    if (Number(floorNum) < 0 || Number(bathroom) < 0 || Number(balcony) < 0) {
      setError("Numeric values cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const result = await predictPrice({
        location,
        carpet_area_sqft: Number(carpetArea),
        floor_num: Number(floorNum),
        bathroom: Number(bathroom),
        balcony: Number(balcony),
        furnishing,
        transaction,
        ownership,
        facing,
      });

      navigate("/result", {
        state: { price: result.predicted_price },
      });
    } catch (err) {
      setError("Unable to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>House Price Prediction</h2>

      {error && <p>{error}</p>}

      <label>Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <label>Carpet Area (sqft)</label>
      <input
        type="number"
        value={carpetArea}
        onChange={(e) => setCarpetArea(e.target.value)}
        min="1"
        required
      />

      <label>Floor</label>
      <input
        type="number"
        value={floorNum}
        onChange={(e) => setFloorNum(e.target.value)}
        min="0"
        required
      />

      <label>Bathrooms</label>
      <input
        type="number"
        value={bathroom}
        onChange={(e) => setBathroom(e.target.value)}
        min="0"
        required
      />

      <label>Balconies</label>
      <input
        type="number"
        value={balcony}
        onChange={(e) => setBalcony(e.target.value)}
        min="0"
        required
      />

      <label>Furnishing</label>
      <select
        value={furnishing}
        onChange={(e) => setFurnishing(e.target.value)}
        required
      >
        <option value="">Select furnishing</option>
        <option value="Furnished">Furnished</option>
        <option value="Semi-Furnished">Semi-Furnished</option>
        <option value="Unfurnished">Unfurnished</option>
      </select>

      <label>Transaction</label>
      <select
        value={transaction}
        onChange={(e) => setTransaction(e.target.value)}
        required
      >
        <option value="">Select transaction</option>
        <option value="Resale">Resale</option>
        <option value="New Property">New Property</option>
      </select>

      <label>Ownership</label>
      <input
        type="text"
        value={ownership}
        onChange={(e) => setOwnership(e.target.value)}
        required
      />

      <label>Facing</label>
      <input
        type="text"
        value={facing}
        onChange={(e) => setFacing(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Predicting..." : "Predict Price"}
      </button>
    </form>
  );
}

export default PredictionForm;
