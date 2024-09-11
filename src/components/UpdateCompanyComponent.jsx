import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';

class UpdateCompanyComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: props.match.params.id, // Accessing the id parameter from the URL
            name: '',
            description: '',
            country: '',
            city: '',
            streetName: '',
            streetNumber: '',
            user: JSON.parse(localStorage.getItem('user')) || {},
            errorMessage: ''
        };

        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeCountryHandler = this.changeCountryHandler.bind(this);
        this.changeCityHandler = this.changeCityHandler.bind(this);
        this.changeStreetNameHandler = this.changeStreetNameHandler.bind(this);
        this.changeStreetNumberHandler = this.changeStreetNumberHandler.bind(this);

        this.updateCompany = this.updateCompany.bind(this);
    }

    componentDidMount() {
        CompanyService.getCompanyById(this.state.companyId).then((res) => {
            let company = res.data;
            this.setState({
                name: company.name,
                description: company.description,
                country: company.location.country,
                city: company.location.city,
                streetName: company.location.street,
                streetNumber: company.location.streetNumber,
            });
        });
    }

    changeNameHandler(event) {
        this.setState({ name: event.target.value });
    }

    changeDescriptionHandler(event) {
        this.setState({ description: event.target.value });
    }

    changeCountryHandler(event) {
        this.setState({ country: event.target.value });
    }

    changeCityHandler(event) {
        this.setState({ city: event.target.value });
    }

    changeStreetNameHandler(event) {
        this.setState({ streetName: event.target.value });
    }

    changeStreetNumberHandler(event) {
        const value = event.target.value;

        // Allow only numeric characters
        if (/^\d*$/.test(value)) {
            this.setState({ streetNumber: value });
        }
    }

    validateTextInput(text) {
        // Check if the text contains only letters and spaces
        return /^[A-Za-z\s]+$/.test(text);
    }

    updateCompany = async (e) => {
        e.preventDefault();

        // Validation
        if (!this.state.name || !this.state.description || !this.state.country || !this.state.city || !this.state.streetName || !this.state.streetNumber) {
            alert("All fields are required.");
            return;
        }

        if (!this.validateTextInput(this.state.name)) {
            alert("Name should contain only text.");
            return;
        }

        if (!this.validateTextInput(this.state.description)) {
            alert("Description should contain only text.");
            return;
        }

        let company = {
            name: this.state.name,
            description: this.state.description,
            country: this.state.country,
            city: this.state.city,
            streetName: this.state.streetName,
            streetNumber: this.state.streetNumber, // Send as string
        };

        CompanyService.updateCompany(this.state.companyId, company)
            .then((res) => {
                this.props.history.push('/api/company-admin/company/' + this.state.companyId);
            })
            .catch((error) => {
                console.error('Error updating company:', error);
                if (error.response) {
                    const errorMessage = error.response.data.message || 'An error occurred';
                    alert(`Error: ${errorMessage}`);
                    this.setState({ errorMessage: errorMessage });
                }
            });
    };

    render() {
        const { user } = this.state;

        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
        };

        if (user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN')) {
            return (
                <div className='container'>
                    <div className='row'>
                        <div className='card col-md-6 offset-md-3 offset-md-3'>
                            <h3 className='text-center'>Update Company</h3>
                            <div className='card-body'>
                                <form>
                                    <div className='form-group'>
                                        <label>Company name: </label>
                                        <input
                                            placeholder='Name'
                                            name='name'
                                            className='form-control'
                                            value={this.state.name}
                                            onChange={this.changeNameHandler}
                                        />
                                    </div>

                                    <div>
                                        <label>Company description: </label>
                                        <input
                                            placeholder='Description'
                                            name='description'
                                            className='form-control'
                                            value={this.state.description}
                                            onChange={this.changeDescriptionHandler}
                                        />
                                    </div>

                                    <div>
                                        <label>Country the company is in: </label>
                                        <input
                                            placeholder='Country'
                                            name='country'
                                            className='form-control'
                                            value={this.state.country}
                                            onChange={this.changeCountryHandler}
                                        />
                                    </div>

                                    <div>
                                        <label>City the company is in: </label>
                                        <input
                                            placeholder='City'
                                            name='city'
                                            className='form-control'
                                            value={this.state.city}
                                            onChange={this.changeCityHandler}
                                        />
                                    </div>

                                    <div>
                                        <label>Name of the street the company is located on: </label>
                                        <input
                                            placeholder='Name'
                                            name='streetName'
                                            className='form-control'
                                            value={this.state.streetName}
                                            onChange={this.changeStreetNameHandler}
                                        />
                                    </div>

                                    <div>
                                        <label>Street number: </label>
                                        <input
                                            type='text'
                                            placeholder='Number'
                                            name='streetNumber'
                                            className='form-control'
                                            value={this.state.streetNumber}
                                            onChange={this.changeStreetNumberHandler}
                                        />
                                    </div>

                                    <button
                                        className='btn btn-success'
                                        onClick={this.updateCompany}
                                        style={buttonStyle}
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='container'>
                    <h3 className='text-center'>You are not eligible to view this page.</h3>
                </div>
            );
        }
    }
}

export default UpdateCompanyComponent;
