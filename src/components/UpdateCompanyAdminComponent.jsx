import React, { Component, useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import CompanyService from '../services/CompanyService';
import CompanyAdminService from '../services/CompanyAdminService';


class UpdateCompanyAdminComponent extends Component {
    

    constructor(props){
        super(props)

        this.state = {
            adminId: props.match.params.id, // Accessing the id parameter from the URL
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          
        }

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.changePasswordHandler = this.changePasswordHandler.bind(this);
       
        this.updateCompanyAdmin  = this.updateCompanyAdmin.bind(this);
    }
    componentDidMount(){
        CompanyAdminService.findBy(this.state.adminId).then((res) =>{
            let admin= res.data;
            this.setState({firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                password: admin.password
    }) 
        })
    }

    changeFirstNameHandler=(event) =>{
        this.setState({firstName: event.target.value});
    }

    changeLastNameHandler=(event) =>{
        this.setState({lastName: event.target.value});
    }

    changeEmailHandler=(event) =>{
        this.setState({email: event.target.value});
    }

    changePasswordHandler=(event) =>{
        this.setState({password: event.target.value});
    }


    updateCompanyAdmin= async(e) =>{
        e.preventDefault();

        let admin = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, 
                       password: this.state.password, companyName: ""};
        console.log('admin =>' + JSON.stringify(admin));
        CompanyAdminService.updateCompanyAdmin(this.state.adminId, admin);
       
    }

    render() {
        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
          };

        return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className='container'>
                    <div className='row'>
                        <div className='card col-md-6 offset-md-3 offset-md-3'>
                            <h3 className='text-center'>Update CompanyAdmin</h3>
                            <div className='card-body'>
                                <form>
                                    <div className='form-group'>
                                        <label>First name: </label>
                                        <input placeholder='FirstName' name='firstName' className='form-control'
                                                value={this.state.firstName || ''} onChange={this.changeFirstNameHandler}/>                                      
                                    </div>

                                    <div>
                                        <label>Last name: </label>
                                        <input placeholder='LastName' name='lastName' className='form-control'
                                                value={this.state.lastName || ''} onChange={this.changeLastNameHandler}/>
                                    </div>

                                    <div>
                                        <label>E-mail: </label>
                                        <input placeholder='Email' name='email' className='form-control'
                                                value={this.state.email || ''} onChange={this.changeEmailHandler}/>
                                    </div>

                                    <div>
                                        <label>Password: </label>
                                        <input placeholder='' name='password' className='form-control'
                                                value={this.state.password || ''} onChange={this.changePasswordHandler}/>
                                    </div>

                            
                                        
                                    <button className='btn btn-success' onClick={this.updateCompanyAdmin} style={buttonStyle}>Update</button>
                                    {/*<button className='btn btn-success' onClick={this.changeCitynHandler.bind(this)} style={{marginLeft: "10px"}}>
                                        Cancel
                                    </button>*/}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </LocalizationProvider>
        );
    }
}

export default UpdateCompanyAdminComponent;