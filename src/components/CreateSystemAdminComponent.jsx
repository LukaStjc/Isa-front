import React, { Component } from 'react';

import SystemAdminService from '../services/SystemAdminService';

class CreateSystemAdminComponent extends Component {

    constructor(props){
        super(props)

        this.state = {
            firstName: '',
            lastName: '',
            email: ''
        }

        this.changeFirstNameHandler = this.changeFirstNameHandler.bind(this);
        this.changeLastNameHandler = this.changeLastNameHandler.bind(this);
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
    }

    changeFirstNameHandler=(e) =>{
        this.setState({firstName: e.target.value});
    }

    changeLastNameHandler=(e) =>{
        this.setState({lastName: e.target.value});
    }

    changeEmailHandler=(e) =>{
        this.setState({email: e.target.value});
    }

    saveSystemAdmin= async(e) =>{
        e.preventDefault();

        if(this.state.firstName === ""){
            console.log("Warning: Admin name is empty");
            return;
        }

        if(this.state.lastName === ""){
            console.log("Warnign: Admin last name is empty");
            return;
        }

        if(this.state.email === ""){
            console.log("Warning: Admin email is empty");
            return;
        }

        let systemAdmin = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email}
        console.log("system admin => " + JSON.stringify(systemAdmin));

        try{
            await SystemAdminService.createSystemAdmin(systemAdmin);
        }
        catch(error){
            console.error("Error creating system admin: ", error);
        }
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Register Company Administrator</h3>
                        <div className='card-body'>
                            <form>
                                
                                <label>Admin first name: </label>
                                <input placeholder='Name' className='form-control' value={this.state.firstName} 
                                    onChange={this.changeFirstNameHandler} />
                            
                                <label>Admin last name: </label>
                                <input placeholder='Last name' className='form-control' value={this.state.lastName} 
                                    onChange={this.changeLastNameHandler} />
                                
                                <label>Admin email: </label>
                                <input placeholder='Email' className='form-control' value={this.state.email} 
                                    onChange={this.changeEmailHandler} />
                                
                                <button className='btn btn-success' onClick={this.saveSystemAdmin} style={{marginTop: '10px'}}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateSystemAdminComponent;