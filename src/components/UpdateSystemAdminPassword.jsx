import React, { Component } from 'react';

import SystemAdminService from '../services/SystemAdminService';

import UserService from "../services/user.service";

class UpdateSystemAdminPassword extends Component {

    constructor(props){
        super(props)

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmedNewPassword: '',
            content: ''
        }

        this.changeOldPasswordHandler = this.changeOldPasswordHandler.bind(this);
        this.changeNewPasswordHandler = this.changeNewPasswordHandler.bind(this);
        this.changeConfirmenNewPassword = this.changeConfirmenNewPassword.bind(this);
    }

    changeOldPasswordHandler=(e) =>{
        this.setState({oldPassword: e.target.value});
    }

    changeNewPasswordHandler=(e)=>{
        this.setState({newPassword: e.target.value});
    }

    changeConfirmenNewPassword=(e)=>{
        this.setState({confirmedNewPassword: e.target.value});
    }

    componentDidMount() {
        UserService.getSystemAdminBoard().then(
          response => {
            this.setState({
              content: response.data
            });
          },
          error => {
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            });
    
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            //   EventBus.dispatch("logout");
              this.props.history.push('/profile');
              console.log("Error: Nemate potrebne privilegije za pristup stranici");
            }
          }
        );
      }

    updatePassword= async(e) =>{
        e.preventDefault();

        if(this.state.oldPassword === ""){
            console.log("Warning: Password field is empty");
            return;
        }

        let isCurrentPassword = await SystemAdminService.isCurrentPassword(this.state.oldPassword);
        if(!isCurrentPassword.data){
            console.log("Incorrect current password");
            return;
        }

        if(this.state.newPassword !== this.state.confirmedNewPassword){
            console.log("Incorrectly typed password confirmation");
            return;
        }

        let userDTO = {firstName: null, lastName: null, email: null, password: this.state.newPassword};
        console.log("password => " + JSON.stringify(this.state.newPassword));

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
                                <label>Current password: </label>
                                <input className='form-control' value={this.state.oldPassword} 
                                    onChange={this.changeOldPasswordHandler}/>

                                <label>New password: </label>
                                <input className='form-control' value={this.state.newPassword} 
                                    onChange={this.changeNewPasswordHandler}/>

                                <label>Confirm new password: </label>
                                <input className='form-control' value={this.state.confirmedNewPassword} 
                                    onChange={this.changeConfirmenNewPassword} type="password"/>

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