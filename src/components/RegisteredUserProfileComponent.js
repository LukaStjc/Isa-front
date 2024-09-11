
import { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { useHistory } from "react-router-dom";
import "../css/UserProfile.css"


const RegisteredUserProfileComponent = () => {

    const [currentUser, setCurrentUser] = useState();
    const history = useHistory();

    useEffect(() => {
        let ignore = false;
        const fetchProfile = async () => {
          try {
            let response = await fetch(`http://localhost:8082/api/profile`, {
              headers: authHeader(),
            });
            if (response.ok) {
              let userData = await response.json();
              if (!ignore) {
                setCurrentUser(userData);
              }
            } else {
              throw new Error('Failed to fetch data');
            }
          } catch (error) {
            console.error('Error:', error);
            setCurrentUser(null);
          }
        };
        fetchProfile();
        return () => {
          ignore = true;
        };
      }, []);

      const forma = (
        <div className="user-data">
          {currentUser ? (
            <>
              <h2 style={{ padding: "20px" }} className="text-center">
                Personal Information
              </h2>
              <div>
                <p>
                  <b>First Name:</b> {currentUser.firstName}
                </p>
              </div>
              <div>
                <p>
                  <b>Last Name:</b> {currentUser.lastName}
                </p>
              </div>
              <div>
                <p>
                  <b>Email:</b> {currentUser.email}
                </p>
              </div>
              <div>
                <p>
                  <b>Telephone number:</b> {currentUser.telephoneNumber}
                </p>
              </div>
              <div>
                <p>
                  <b>Penalty points:</b> {currentUser.penaltyPoints}
                </p>
              </div>
              <div>
                <p>
                  <b>Loyalty program:</b> {currentUser.loyaltyProgram.type}{" "}
                  (Benefits include {currentUser.loyaltyProgram.discount_rate}%
                  discount for every future purchase.)
                </p>
              </div>
              <div>
                <p>
                  <b>Hospital:</b> {currentUser.hospital.name}
                </p>
              </div>
              <div>
                <p>
                  <b>Occupation:</b> {currentUser.occupation}
                </p>
              </div>
              <div>
                <p>
                  <b>Collected Points:</b> {currentUser.points}
                </p>
              </div>
              <div>
                <p>
                  <b>Country:</b> {currentUser.location.country}
                </p>
              </div>
              <div>
                <p>
                  <b>City:</b> {currentUser.location.city}
                </p>
              </div>
              <div>
                <p>
                  <b>Street Name:</b> {currentUser.location.street}
                </p>
              </div>
              <div>
                <p>
                  <b>Street Number:</b> {currentUser.location.streetNumber}
                </p>
              </div>
              <button
                className="btn btn-primary mr-3"
                onClick={() => history.push("regUserProfileEdit", { currentUser })}
              >
                Edit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => history.push("regUserProfileEditPassword")}
              >
                Change Password
              </button>
            </>
          ) : (
            <div> Please log in! </div>
          )}
        </div>
      );
    
      return forma;
    
};
export default RegisteredUserProfileComponent;