
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import authHeader from "../services/auth-header";

const RegisteredUserProfileEditComponent = () => {

    const location = useLocation();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(location.state?.currentUser);

    const [firstName, setFirstName] = useState(currentUser?.firstName);
    const [lastName, setLastName] = useState(currentUser?.lastName);
    const [telephoneNumber, setTelephoneNumber] = useState(currentUser?.telephoneNumber);
    const [country, setCountry] = useState(currentUser?.location.country);
    const [city, setCity] = useState(currentUser?.location.city);
    const [streetName, setStreetName] = useState(currentUser?.location.street);
    const [streetNumber, setStreetNumber] = useState(currentUser?.location.streetNumber);

    const [errors, setErrors] = useState({})

    const validateField = (name, value) => {
        let error = "";
        if(!value){
            error = "This field cannot be empty.";
        }else if(name==="telephoneNumber" && !/^\d*$/.test(value)){
            error = "Telephone number must contain only number.";
        }
        setErrors((prev) => ({...prev, [name]: error}));
        console.log(errors);
        return error ==="";
    };

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        validateField(name, value);

        switch (name) {
            case "firstName":
              setFirstName(value);
              break;
            case "lastName":
              setLastName(value);
              break;
            case "telephoneNumber":
              setTelephoneNumber(value);
              break;
            case "country":
              setCountry(value);
              break;
            case "city":
              setCity(value);
              break;
            case "streetName":
              setStreetName(value);
              break;
            case "streetNumber":
              setStreetNumber(value);
              break;
            default:
              break;
        }


    }

    const updateUser = async () => {
        if(Object.values(errors).every((err)=> !err)){

            const response = await fetch('http://localhost:8082/api/profile/update', {
                method: "PATCH",
                headers: authHeader(),
                body: JSON.stringify({
                    firstName,
                    lastName,
                    telephoneNumber,
                    country,
                    city,
                    streetName,
                    streetNumber,
                }),
            });
    
    
            if(response.ok){
                history.push("/regUserProfile");
            }else{
                console.error("Failed to update user profile!!");
            }

        }else{
            console.error("Form contains errors", errors);
        }
        




    };

    const canSave = 
        Object.values(errors).every((err) => !err) &&
        [
            firstName,
            lastName,
            telephoneNumber,
            country,
            city,
            streetName,
            streetNumber
        ].every((v)=>v);   









    return ( currentUser ? 
        (<div>
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <div style={{ color: "red" }}>{errors.firstName}</div>
              )}
            </label>
          </div>
          <div>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <div style={{ color: "red" }}>{errors.lastName}</div>
              )}
            </label>
          </div>
          <div>
            <label>
              Telephone:
              <input
                type="text"
                name="telephoneNumber"
                value={telephoneNumber}
                onChange={handleInputChange}
              />
              {errors.telephoneNumber && (
                <div style={{ color: "red" }}>{errors.telephoneNumber}</div>
              )}
            </label>
          </div>
          <div>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={country}
                onChange={handleInputChange}
              />
              {errors.country && (
                <div style={{ color: "red" }}>{errors.country}</div>
              )}
            </label>
          </div>
          <div>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={city}
                onChange={handleInputChange}
              />
              {errors.city && <div style={{ color: "red" }}>{errors.city}</div>}
            </label>
          </div>
          <div>
            <label>
              Street Name:
              <input
                type="text"
                name="streetName"
                value={streetName}
                onChange={handleInputChange}
              />
              {errors.streetName && (
                <div style={{ color: "red" }}>{errors.streetName}</div>
              )}
            </label>
          </div>
          <div>
            <label>
              Street Number:
              <input
                type="text"
                name="streetNumber"
                value={streetNumber}
                onChange={handleInputChange}
              />
              {errors.streetNumber && (
                <div style={{ color: "red" }}>{errors.streetNumber}</div>
              )}
            </label>
          </div>
          <button onClick={updateUser} disabled={!canSave}>
            Save
          </button>
        </div>) : <div>Please log in!</div>
      );










    
};
export default RegisteredUserProfileEditComponent;