import { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import "../css/QR.css"

const QRComponent = () => {
  const [decodedData, setDecodedData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    sortBy: "", 
  });


  const fetchData = async () => {
    const queryParams = new URLSearchParams(
      searchParams.sortBy ? { status: searchParams.sortBy } : {}
    ).toString();

    try {
      const response = await fetch(
        `http://localhost:8082/qrcode/reservations${queryParams ? `?${queryParams}` : ''}`,
        {
          method: "GET",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        const qrCodesBase64 = await response.json();
        console.log("Data received:", qrCodesBase64);
        setDecodedData(qrCodesBase64);
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();  // Call fetch function when the component mounts
  }, []);  // Empty dependency array ensures this effect runs only once after the initial render

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    fetchData();  // Fetch data when search button is clicked
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Filter Parameters</h2>
        <div>
          <label htmlFor="sortBy">Filter:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value="Ready">Ready</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>Search</button>
      </div>
      <div style={{ flex: 2 }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Results</h2>
        {decodedData.length > 0 ? (
          <div>
            {decodedData.map((base64, index) => (
              <div key={index}>
                <img
                  src={`data:image/png;base64,${base64}`}
                  alt={`QR Code ${index + 1}`}
                  className="qr-code-img"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>Your QR list is empty.</div>
        )}
      </div>
    </div>
  );
};

export default QRComponent;
