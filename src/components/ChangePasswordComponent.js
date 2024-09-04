import { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { useHistory, useLocation } from "react-router-dom";
import authService from "../services/auth.service";
import "../css/UserProfile.css"



const ChangePasswordComponent = () => {

    const history = useHistory();

    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();


    const [errors, setErrors] = useState({})

    const validateField = (name, value) => {
        let error = "";
        if(!value){
            error = "This field cannot be empty.";
        }
        setErrors((prev) => ({...prev, [name]: error}));
        console.log(errors);
        return error ==="";
    };

    const handleInputChange = (e) => {

        const {name, value} = e.target;
        validateField(name, value);
       
        switch (name) {
            case "newPassword":
              setNewPassword(value);
              break;
            case "oldPassword":
              setOldPassword(value);
              break;
            default:
              break;
        }
    }



    const changePassword = async () => {

        if(Object.values(errors).every((err)=> !err)){

            const response = await fetch('http://localhost:8082/api/user/changepassword', {
                method: "PUT",
                headers: authHeader(),
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });
    
            if(response.ok){
                authService.logout();
                history.push("/login");
            }else{
                alert("Try again!")
                console.error("ERROR!");
            }
        }else{
            console.error("Form contains errors", errors);
        }
    }


    const canSave = 
        Object.values(errors).every((err) => !err) &&
        [
            oldPassword,
            newPassword,
        ].every((v)=>v);   


    return (
        <div className="user-data"> 
            <h2 style={{ padding: "20px" }} className="text-center">
                Change Password
            </h2>
            <div>
                <p>
                    <b>Old password:</b>{" "}
                    <input
                        type="password"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={handleInputChange}
                        className="ml-2"
                    />{" "}
                </p>
            </div>

            <div>
                <p>
                    <b>New password:</b>{" "}
                    <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handleInputChange}
                        className="ml-2"
                    />{" "}
                </p>
            </div>


          <button className="btn btn-primary" onClick={changePassword} disabled={!canSave}>
            Save
          </button>
        </div>)
};

export default ChangePasswordComponent;