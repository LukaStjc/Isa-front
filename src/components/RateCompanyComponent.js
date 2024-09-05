import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../css/RateCompany.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import authHeader from "../services/auth-header";

const RateCompanyComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const company = location.state?.company;
  const [lastRating, setLastRating] = useState(false);
  const [rating, setRating] = useState(0); // Default rating
  const [customReason, setCustomReason] = useState("");
  const reasons = [
    "Customer Service",
    "Product Quality",
    "Value for Money",
    "Others",
  ];
  const [selectedReasons, setSelectedReasons] = useState(new Set());

  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      try {
        let response = await fetch(
          `http://localhost:8082/api/ratings/findRating/${company.id}`,
          {
            headers: authHeader(),
          }
        );
        if (response.ok) {
          let userData = await response.json();
          console.log(userData);
          if (!ignore) {
            setRating(userData.score);
            setCustomReason(userData.feedback);
            const dateObject = new Date(
              userData.updatedAt[0],
              userData.updatedAt[1] - 1,
              userData.updatedAt[2],
              userData.updatedAt[3],
              userData.updatedAt[4],
              userData.updatedAt[5]
            );
            const formattedDate = dateObject.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            setLastRating(formattedDate);
            const newSet = new Set();
            for (let i = 0; i < userData.reasons.length; i++) {
              newSet.add(userData.reasons[i]);
            } 

            setSelectedReasons(newSet);
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
        //setRatingData([]); // Handle error by setting currentUser to null
      }
    };
    fetchProfile();
    return () => {
      ignore = true;
    };
  }, []);

  const handleReasonChange = (event) => {
    const reason = event.target.value;
    setSelectedReasons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reason)) {
        newSet.delete(reason);
      } else {
        newSet.add(reason);
      }
      return newSet;
    });
  };

  const submitRating = async () => {

    if (rating < 1 || rating > 10) {
        alert('Please enter a rating between 1 and 10.');
        return; 
      }

    const data = {
      rating,
      reasons: Array.from(selectedReasons),
      customReason,
    };
    console.log("Submitting rating:", data);
    // Here you would typically send `data` to your server via an API call
    try {
      const response = await fetch(`http://localhost:8082/api/ratings/rate`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
          company: company.id,
          score: rating,
          feedback: customReason,
          reasons: Array.from(selectedReasons),
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the server returns JSON data
        console.log("Data received:", data);
        alert("Thank you for your feedback!");
        history.push(`/showCompanies`);
        // You can handle the data here, for example, updating state or displaying in the UI
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle errors more specifically if needed
    }
  };

  return (
    <div className="rate-company">
      <h1>Rate the Company:</h1>
      <h4>Company Name: {company.name}</h4>
      <h6>Last Rating: {lastRating}</h6>
      <div className="form-group">
        <label htmlFor="rating">Rating (1-10):</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <div className="form-group">
        <h2>Select reasons for your rating:</h2>
        {reasons.map((reason, index) => (
          <div key={index} className="checkbox-group">
            <input
              type="checkbox"
              id={reason}
              value={reason}
              onChange={handleReasonChange}
              checked={selectedReasons.has(reason)}
            />
            <label htmlFor={reason}>{reason}</label>
          </div>
        ))}
      </div>
      <div className="form-group">
        <label htmlFor="customReason">Your own reason:</label>
        <input
          type="text"
          id="customReason"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      </div>
      <button onClick={submitRating}>Submit Rating</button>
    </div>
  );
};

export default RateCompanyComponent;
