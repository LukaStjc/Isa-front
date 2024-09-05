import { useState } from "react";
import authHeader from "../services/auth-header";
//import jsQR from "jsqr";

const QRComponent = () => {
  const [decodedData, setDecodedData] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchParams, setSearchParams] = useState({
    sortBy: "Ready", // Default sort by name
  });

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const queryParams = new URLSearchParams({
      status: searchParams.sortBy,
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:8082/qrcode/reservations?status=${searchParams.sortBy}`,
        {
          method: "GET",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        const qrCodesBase64 = await response.json(); // Assuming the server returns JSON data
        console.log("Data received:", qrCodesBase64);

        setDecodedData(qrCodesBase64);
        // You can handle the data here, for example, updating state or displaying in the UI
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
      // Handle errors more specifically if needed
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Filter Parameters </h2>
        <div>
          <label htmlFor="sortBy">Filter:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={handleInputChange}
          >
            <option value="null">All</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>Search</button>
      </div>
      <div style={{ flex: 2 }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Results</h2>
        <div>
          {decodedData.map((base64, index) => (
            <div>
              <img
                key={index}
                src={`data:image/png;base64,${base64}`}
                alt={`QR Code ${index + 1}`}
                style={{ width: "200px", height: "200px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRComponent;
