import React, { Component } from 'react';

class SysAdminHomePageComponent extends Component {

    registerCompany(){
        this.props.history.push('/api/companies/create');
    }

    registerCompanyAdmin(){
        this.props.history.push('/api/company-admins/create');
    }

    equipmentOrdering(){
        this.props.history.push('/api/equipment/ordering');
    }

    registerSystemAdmin(){
        this.props.history.push('/api/system-admins/create');
    }

    viewAllComplaints(){
        this.props.history.push('/api/complaints');
    }

    changePassword(){
        this.props.history.push('/api/system-admins/update-password');
    }


    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>This is your home page!</h3>
                        <div className='card-body'>
                            <div className='form-group d-flex justify-content-between'>
                                <label>Register a new company</label>
                                <button onClick={() => this.registerCompany()} className='btn btn-primary'>Click Here</button>
                            </div>

                            <div className='form-group d-flex justify-content-between'>
                                <label>Register a new company administrator</label>
                                <button onClick={() => this.registerCompanyAdmin()} className='btn btn-primary'>Click Here</button>
                            </div>

                            <div className='form-group d-flex justify-content-between'>
                                <label>Order equipment</label>
                                <button onClick={() => this.equipmentOrdering()} className='btn btn-primary'>Click Here</button>
                            </div>

                            <div className='form-group d-flex justify-content-between'>
                                <label>Register a new system admin</label>
                                <button onClick={() => this.registerSystemAdmin()} className='btn btn-primary'>Click Here</button>
                            </div>

                            <div className='form-group d-flex justify-content-between'>
                                <label>Reply to a complaint</label>
                                <button onClick={() => this.viewAllComplaints()} className='btn btn-primary'>Click Here</button>
                            </div>

                            <div className='form-group d-flex justify-content-between'>
                                <label>Change your password</label>
                                <button onClick={() => this.changePassword()} className='btn btn-primary'>Click Here</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default SysAdminHomePageComponent;