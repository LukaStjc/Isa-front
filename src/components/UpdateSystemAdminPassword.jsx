import React, { Component } from 'react';

import SystemAdminService from '../services/SystemAdminService';

class UpdateSystemAdminPassword extends Component {

    constructor(props){
        super(props)

        this.state = {
            password: ''
        }

        this.changePasswordHandler = this.changePasswordHandler.bind(this);
    }

    changePasswordHandler=(e) =>{
        this.setState({password: e.target.value});
    }

    updatePassword= async(e) =>{
        e.preventDefault();

        if(this.state.password === ""){
            console.log("Warning: Password field is empty");
            return;
        }

        let userDTO = {firstName: null, lastName: null, email: null, password: this.state.password};
        console.log("password => " + JSON.stringify(this.state.password));

        try{
            await SystemAdminService.updatePassword(userDTO);
        }
        catch(error){
            console.error("Error updating password");
        }
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Change your password</h3>
                        <div className='card-body'>
                            <form>
                                <label>New password: </label>
                                <input className='form-control' value={this.state.password} 
                                    onChange={this.changePasswordHandler}/>

                                <button className='btn btn-success' onClick={this.updatePassword} style={{marginTop: '10px'}}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateSystemAdminPassword;