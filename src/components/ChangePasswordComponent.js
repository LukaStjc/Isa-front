import { useEffect, useState } from "react";
import authHeader from "../services/auth-header";
import { useHistory } from "react-router-dom";
import authService from "../services/auth.service";
import "../css/UserProfile.css";

const ChangePasswordComponent = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const validateFields = (name, value) => {
        let error = '';
        if (!value) {
            error = "This field cannot be empty.";
        } else if (name === "newPassword" && value.length < 3) {
            error = "Password must be at least 3 characters.";
        } else if (name === "newPassword" && formData.oldPassword === value) {
            error = "New password must be different from old password.";
        } else if (name === "confirmPassword" && value !== formData.newPassword) {
            error = "Passwords do not match.";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateFields(name, value);
    };

    const changePassword = async () => {
        if (Object.values(errors).every(err => !err) && formData.oldPassword && formData.newPassword && formData.confirmPassword) {
            try {
                const response = await fetch('http://localhost:8082/api/user/changepassword', {
                    method: "PUT",
                    headers: authHeader(),
                    body: JSON.stringify({
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword,
                    }),
                });

                if (response.ok) {
                    authService.logout();
                    alert("Password changed successfully!");
                    history.push("/login");
                } else {
                    throw new Error("Your old password is not correct. Try Again!");
                }
            } catch (error) {
                alert(error.message);
                console.error("ERROR!", error);
            }
        } else {
            console.error("Form contains errors", errors);
        }
    };

    const canSave = Object.values(errors).every(err => !err) &&
                    formData.oldPassword &&
                    formData.newPassword &&
                    formData.confirmPassword;

    return (
        <div className="user-data">
            <h2 style={{ padding: "20px" }} className="text-center">
                Change Password
            </h2>
            <div>
                <label>
                    <b>Old password:</b>{" "}
                    <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="ml-2"
                    />
                    {errors.oldPassword && <div style={{ color: "red" }}>{errors.oldPassword}</div>}
                </label>
            </div>

            <div>
                <label>
                    <b>New password:</b>{" "}
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="ml-2"
                    />
                    {errors.newPassword && <div style={{ color: "red" }}>{errors.newPassword}</div>}
                </label>
            </div>

            <div>
                <label>
                    <b>Confirm new password:</b>{" "}
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="ml-2"
                    />
                    {errors.confirmPassword && <div style={{ color: "red" }}>{errors.confirmPassword}</div>}
                </label>
            </div>

            <button className="btn btn-primary" onClick={changePassword} disabled={!canSave}>
                Save
            </button>
        </div>
    );
};

export default ChangePasswordComponent;
