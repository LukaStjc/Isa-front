import { useState, useEffect } from "react";
import authHeader from "../services/auth-header";

const CollectedHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchParams, setSearchParams] = useState({
    sortBy: "startingDate", 
    sortDirection: "asc",
  });

  
  const fetchData = async () => {
    const queryParams = new URLSearchParams({
      sortBy: searchParams.sortBy,
      sortDirection: searchParams.sortDirection,
    }).toString();

    try {
      const response = await fetch(
        `http://localhost:8082/api/reservations/history-completed?${queryParams}`,
        {
          method: "GET",
          headers: authHeader(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Data received:", data);
        setHistory(data);
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);  

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    fetchData();  
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Sort Parameters</h2>
        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={handleInputChange}
          >
            <option value="startingDate">Starting Date</option>
            <option value="totalSum">Total Sum</option>
            <option value="durationMinutes">Duration Minutes</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortDirection">Sort Direction:</label>
          <select
            id="sortDirection"
            name="sortDirection"
            value={searchParams.sortDirection}
            onChange={handleInputChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleSubmit}>Search</button>
      </div>
      <div style={{ flex: 2 }}>
        <h2 style={{ paddingTop: "20px", paddingBottom: "20px" }}>Results</h2>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Total Sum</th>
              <th>Starting Date</th>
              <th>Duration (min)</th>
              <th>Equipment (quantity)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.totalSum}</td>
                <td>{appointment.startingDate}</td>
                <td>{appointment.durationMinutes}</td>
                <td>
                  {appointment.items.map((item, index) => (
                    <p key={index}>
                      {item.equipmentName} ({item.quantity})
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectedHistory;
