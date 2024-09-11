import React, { Component } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Redirect } from 'react-router-dom';

import CompanyAdminService from '../services/CompanyAdminService';

class UpdateCompanyAdminComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            user: JSON.parse(localStorage.getItem('user')) || {},
            redirectToHome: false, // Add a flag to handle redirection for ROLE_COMPANY_ADMIN
        };

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);

        this.updateCompanyAdmin = this.updateCompanyAdmin.bind(this);
    }

    componentDidMount() {
        CompanyAdminService.findBy(this.state.user.id).then((res) => {
            let admin = res.data;
            this.setState({
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                password: admin.password,
            });
        });
    }

    changeFirstNameHandler = (event) => {
        this.setState({ firstName: event.target.value });
    };

    changeLastNameHandler = (event) => {
        this.setState({ lastName: event.target.value });
    };

    changeEmailHandler = (event) => {
        this.setState({ email: event.target.value });
    };

    changePasswordHandler = (event) => {
        this.setState({ password: event.target.value });
    };

    updateCompanyAdmin = async (e) => {
        e.preventDefault();

        let admin = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            companyName: '',
        };
        console.log('admin =>' + JSON.stringify(admin));

        try {
            await CompanyAdminService.updateCompanyAdmin(this.state.user.id, admin);

            if (this.state.user.roles.includes('ROLE_COMPANY_ADMIN')) {
                this.setState({ redirectToHome: true });
            } else {
                this.props.history.push('/api/company-admins/' + this.state.user.id);
            }
        } catch (error) {
            console.error('Error updating company admin:', error);
        }
    };

    render() {
        const { user, redirectToHome } = this.state;
    
        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
        };
    
        // Redirect if necessary
        if (redirectToHome) {
            return <Redirect to="/api/company-admins/home" />;
        }
    
        // Check if user is a SYSTEM_ADMIN or COMPANY_ADMIN
        if (
            user &&
            user.roles &&
            (user.roles.includes('ROLE_SYSTEM_ADMIN') ||
                user.roles.includes('ROLE_COMPANY_ADMIN'))
        ) {
            // Conditional heading text based on user role
            const headingText = user.roles.includes('ROLE_COMPANY_ADMIN')
                ? 'Update Profile'
                : 'Update Company Admin';
    
            return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div className="container">
                        <div className="row">
                            <div className="card col-md-6 offset-md-3 offset-md-3">
                                <h3 className="text-center">{headingText}</h3>
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <label>First name: </label>
                                            <input
                                                placeholder="FirstName"
                                                name="firstName"
                                                className="form-control"
                                                value={this.state.firstName || ''}
                                                onChange={this.changeFirstNameHandler}
                                            />
                                        </div>
    
                                        <div>
                                            <label>Last name: </label>
                                            <input
                                                placeholder="LastName"
                                                name="lastName"
                                                className="form-control"
                                                value={this.state.lastName || ''}
                                                onChange={this.changeLastNameHandler}
                                            />
                                        </div>
    
                                        <div>
                                            <label>E-mail: </label>
                                            <input
                                                placeholder="Email"
                                                name="email"
                                                className="form-control"
                                                value={this.state.email || ''}
                                                onChange={this.changeEmailHandler}
                                            />
                                        </div>
    
                                        <div>
                                            <label>Password: </label>
                                            <input
                                                placeholder=""
                                                name="password"
                                                className="form-control"
                                                value={this.state.password || ''}
                                                onChange={this.changePasswordHandler}
                                            />
                                        </div>
    
                                        <button
                                            className="btn btn-success"
                                            onClick={this.updateCompanyAdmin}
                                            style={buttonStyle}
                                        >
                                            Update
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </LocalizationProvider>
            );
        } else {
            return <Redirect to="/api/companies" />;
        }
    }
}    
export default UpdateCompanyAdminComponent;
