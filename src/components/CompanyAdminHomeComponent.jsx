import React, { Component } from 'react';
import CompanyAdminService from '../services/CompanyAdminService';
import { Redirect } from 'react-router-dom';

class CompanyAdminHomeComponent extends Component {
    constructor(props) {
        super(props);
        
        // Get user from local storage
        const user = JSON.parse(localStorage.getItem('user')) || {};
        
        // Set adminId from user id if it exists
        this.state = {
            adminId: user.id,
            admin: null,
            user: user,
        };
    }

    updateCompanyAdmin() {
        const { adminId } = this.state; // Use adminId from state
        this.props.history.push(`/api/company-admins/update/` + adminId);
    }

    showCalendar() {
        this.props.history.push(`/api/company-admins/company-working-days`);
    }

    showUsersWithReservations() {
        this.props.history.push(`/api/reservations/get-users`);    
    }

    showAvailableReservations() {
        const { adminId } = this.state; // Use adminId from state
        this.props.history.push(`/api/reservations/available`);    
    }

    componentDidMount() {
        const { adminId } = this.state; // Use adminId from state
        CompanyAdminService.findBy(adminId)
            .then((res) => {
                // Handle the response and update the state with company data
                this.setState({ admin: res.data });
            })
            .catch(error => {
                // Handle error if necessary
                console.error('Error fetching admin:', error);
            });
    }

    render() {
        const { user } = this.state; 

        if (user && user.roles && (user.roles.includes('ROLE_COMPANY_ADMIN'))) {
            return (
                <div>
                    <div>
                        {/* Additional content can go here */}
                    </div>
                    <div>
                        <button onClick={() => this.updateCompanyAdmin()} className='btn-btn-info'>Update company admin</button>
                    </div>
                    <div>
                        <button onClick={() => this.showCalendar()} className='btn-btn-info'>Show calendar</button>
                    </div>
                    <div>
                        <button onClick={() => this.showUsersWithReservations()} className='btn-btn-info'>Show users that made reservations</button>
                    </div>
                    <div>
                        <button onClick={() => this.showAvailableReservations()} className='btn-btn-info'>Available reservations</button>
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/api/companies" />;
        }
    }
}

export default CompanyAdminHomeComponent;
