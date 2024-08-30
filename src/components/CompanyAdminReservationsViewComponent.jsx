import React, { Component } from 'react';
import ReservationService from '../services/ReservationService';
class CompAdminReservationsViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [], // To store the fetched users
        };
    }

    componentDidMount() {
        const companyAdmin = JSON.parse(localStorage.getItem('user'));
        const companyAdminId = companyAdmin?.id;

        if (companyAdminId) {
            ReservationService.getAllUsersByCompanyAdmin(companyAdminId)
                .then(response => {
                    this.setState({ users: response.data });
                })
                .catch(error => {
                    console.error("There was an error fetching the users!", error);
                });
        }
    }

    render() {
        const { users } = this.state;
    
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Users with Reservations within Your Company</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', textAlign: 'center',  borderBottom: '2px solid #ddd' }}>First Name</th>
                            <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Last Name</th>
                            <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>E-mail</th>

                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px', textAlign: 'center' }}>{user.firstName}</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>{user.lastName}</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
}

export default CompAdminReservationsViewComponent;
