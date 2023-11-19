import React, { Component } from 'react';
import RegisteredUserService from '../services/RegisteredUserService';


class CreateUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            passwordMatch: true,
            telephoneNumber: '',
            occupation: '',
            country: '',
            city: '',
            streetName: '',
            streetNumber: '',
            hospitalIdentificationNumber: ''
        };

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
        this.changeTelephoneNumberHandler = this.changeTelephoneNumberHandler.bind(this);
        this.changeOccupationHandler = this.changeOccupationHandler.bind(this);
        this.changeCountryHandler = this.changeCountryHandler.bind(this);
        this.changeCityHandler = this.changeCityHandler.bind(this);
        this.changeStreetNameHandler = this.changeStreetNameHandler.bind(this);
        this.changeStreetNumberHandler = this.changeStreetNumberHandler.bind(this);
        this.changeHospitalIdentificationNumber = this.changeHospitalIdentificationNumber.bind(this);

        this.saveUser = this.saveUser.bind(this);
    }


    changeFirstNameHandler=(event) =>{
        this.setState({firstName: event.target.value})
    }

    changeLastNameHandler=(event) =>{
        this.setState({lastName: event.target.value})
    }

    changeEmailHandler=(event) =>{
        this.setState({email: event.target.value})
    }

    changePasswordHandler=(event) =>{
        this.setState({password: event.target.value})
    }

    changeConfirmPasswordHandler = (event) => {
        const confirmPassword = event.target.value;
        const passwordMatch = this.state.password === confirmPassword;
        this.setState({ confirmPassword, passwordMatch });
    }    

    changeOccupationHandler=(event) =>{
        this.setState({occupation: event.target.value})
    }

    changeTelephoneNumberHandler=(event) =>{
        this.setState({telephoneNumber: event.target.value})
    }

    changeCountryHandler=(event) =>{
        this.setState({country: event.target.value})
    }

    changeCityHandler=(event) =>{
        this.setState({city: event.target.value})
    }

    changeStreetNameHandler=(event) =>{
        this.setState({streetName: event.target.value})
    }

    changeStreetNumberHandler=(event) =>{
        this.setState({streetNumber: event.target.value})
    }

    changeHospitalIdentificationNumber=(event) =>{
        this.setState({hospitalIdentificationNumber: event.target.value})
    }

    saveUser = async (e) => {
        e.preventDefault();
    
        
        if (this.state.password !== this.state.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        const textFields = ['firstName', 'lastName', 'country', 'streetName', 'occupation', 'city'];
        for (const field of textFields) {
            if (!/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/.test(this.state[field])) {
                alert(`${field} should contain only text`);
                return;
            }            
        }
    
        if (!/^\S+@\S+\.\S+$/.test(this.state.email)) {
            alert("Invalid email format");
            return;
        }
    
        const numberFields = ['telephoneNumber', 'streetNumber', 'hospitalIdentificationNumber'];
        for (const field of numberFields) {
            if (!/^\d+$/.test(this.state[field])) {
                alert(`${field} should contain only numbers`);
                return;
            }
        }
    
        let user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            occupation: this.state.occupation,
            telephoneNumber: this.state.telephoneNumber,
            country: this.state.country,
            city: this.state.city,
            streetName: this.state.streetName,
            streetNumber: this.state.streetNumber,
            hospitalId: this.state.hospitalIdentificationNumber
        };
    
        console.log('user =>' + JSON.stringify(user));
    
        try {
            await RegisteredUserService.createUser(user);
    
            alert("User successfully created!");
    
            this.props.history.push('/signup');
        } catch (error) {
            console.error('Error creating user:', error);

            alert("Error creating user. Please try again.");
        }
    }
     

    render() {
        const topMarginStyle = {
            margin: '15px 0 0 0', // top right bottom left
          };
          

        return (
                <div className='container' style={{marginBottom: '15px', marginTop: '15px'}}>
                    <div className='row' >
                        <div className='card col-md-6 offset-md-3 offset-md-3'>
                            <h3 style={topMarginStyle} className='text-center'>Register User</h3>
                            <div className='card-body'>
                                <form>
                                <div className='form-group'>
                                        <label>First name: </label>
                                        <input
                                            placeholder='First name'
                                            name='firstName'
                                            className='form-control'
                                            value={this.state.firstName}
                                            onChange={this.changeFirstNameHandler}
                                        />
                                    </div>
                                    <div>
                                        <label>Last name: </label>
                                        <input
                                            placeholder='Last name'
                                            name='lastName'
                                            className='form-control'
                                            value={this.state.lastName}
                                            onChange={this.changeLastNameHandler}
                                        />
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>Email address: </label>
                                        <input placeholder='Email' name='email' className='form-control'
                                                value={this.state.email} onChange={this.changeEmailHandler}/>
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>Password: </label>
                                        <input
                                            placeholder='Password'
                                            type='password'
                                            name='password'
                                            className='form-control'
                                            value={this.state.password}
                                            onChange={this.changePasswordHandler}
                                        />
                                    </div>

                                    <div style={topMarginStyle} className={this.state.passwordMatch ? '' : 'password-mismatch'}>
                                        <label>Confirm Password: </label>
                                        <input
                                            placeholder='Confirm password'
                                            type='password'
                                            name='confirmPassword'
                                            className={`form-control ${this.state.passwordMatch ? '' : 'password-mismatch'}`}
                                            value={this.state.confirmPassword}
                                            onChange={this.changeConfirmPasswordHandler}
                                        />
                                    </div>


                                    <div style={topMarginStyle}>
                                        <label>Telephone number: </label>
                                        <input placeholder='Telephone number' name='telephoneNumber' className='form-control'
                                                value={this.state.telephoneNumber} onChange={this.changeTelephoneNumberHandler}/>
                                    </div>    
                                    
                                    <div style={topMarginStyle}>
                                        <label>Occupation: </label>
                                        <input placeholder='Occupation' name='occupation' className='form-control'
                                                value={this.state.occupation} onChange={this.changeOccupationHandler}/>
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>Country: </label>
                                        <input placeholder='Country' name='country' className='form-control'
                                                value={this.state.country} onChange={this.changeCountryHandler}/>
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>City: </label>
                                        <input placeholder='City' name='city' className='form-control'
                                                value={this.state.city} onChange={this.changeCityHandler}/>
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>Street name: </label>
                                        <input placeholder='Street name' name='streetName' className='form-control'
                                                value={this.state.streetName} onChange={this.changeStreetNameHandler}/>
                                    </div>

                                    <div style={topMarginStyle}>
                                        <label>Street number: </label>
                                        <input placeholder='Number' name='streetNumber' className='form-control'
                                                value={this.state.streetNumber} onChange={this.changeStreetNumberHandler}/>
                                    </div>
                                    
                                    <div style={topMarginStyle}>
                                        <label>Hospital identification number: </label>
                                        <input placeholder='Hospital identification number' name='hospitalIdentificationNumber' className='form-control'
                                                value={this.state.hospitalIdentificationNumber} onChange={this.changeHospitalIdentificationNumber}/>
                                    </div>
                                        
                                    <button className='btn btn-success' onClick={this.saveUser} style={topMarginStyle}>Register</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default CreateUserComponent;