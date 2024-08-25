import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import CompanyAdminService from "../services/CompanyAdminService";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
    return null;
};

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordConfirmed = this.onChangePasswordConfirmed.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

        this.state = {
            password: "",
            passwordConfirmed: "",
            loading: false,
            message: ""
        };
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangePasswordConfirmed(e) {
        this.setState({
            passwordConfirmed: e.target.value
        });
    }

    handlePasswordChange(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            // Check if passwords match
            if (this.state.password !== this.state.passwordConfirmed) {
                this.setState({
                    message: "Passwords do not match!",
                    loading: false
                });
                return;
            }

            // Get user ID from local storage
            const user = JSON.parse(localStorage.getItem("user"));
            
            let changePasswordDTO = {password: this.state.password, id: user.id};
            CompanyAdminService.changePassword(changePasswordDTO).then(
                () => {
                    this.props.history.push("/profile"); // or any other route you want
                    window.location.reload();
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handlePasswordChange}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <Input
                                type="password"
                                className="form-control"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="passwordConfirmed">Confirm New Password</label>
                            <Input
                                type="password"
                                className="form-control"
                                name="passwordConfirmed"
                                value={this.state.passwordConfirmed}
                                onChange={this.onChangePasswordConfirmed}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-primary btn-block"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Confirm</span>
                            </button>
                        </div>

                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}
