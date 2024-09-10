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
        this.props.history.push(`/api/company-admins/update`);
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
                <div style={styles.container}>
                    <div style={styles.buttonContainer}>
                        <button onClick={() => this.updateCompanyAdmin()} style={styles.button}>Update Profile</button>
                        <button onClick={() => this.showCalendar()} style={styles.button}>Show Calendar</button>
                        <button onClick={() => this.showUsersWithReservations()} style={styles.button}>Show Users with Reservations</button>
                        <button onClick={() => this.showAvailableReservations()} style={styles.button}>Available Reservations</button>                    
                    </div>
                </div>
            );
        } else {
            return <Redirect to="/api/companies" />;
        }
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#17a2b8',
        color: 'white',
    }
};
export default CompanyAdminHomeComponent;
