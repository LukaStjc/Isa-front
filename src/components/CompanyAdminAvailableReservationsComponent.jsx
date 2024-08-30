import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReservationService from '../services/ReservationService'; // Adjust the import path as needed

class CompanyAdminAvailableReservationsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: []
        };
    }

    componentDidMount() {
        const admin = JSON.parse(localStorage.getItem('user')); // Assuming the admin ID is stored in local storage
        this.loadReservations(admin.id);
    }

    loadReservations(adminId) {
        ReservationService.getAvailableReservations(adminId).then(res => {
            this.setState({ reservations: res.data });
        }).catch(err => {
            console.error("Error loading reservations:", err);
        });
    }



    MarkCompleted(reservationId) {
        ReservationService.markReservationCompleted(reservationId)
            .then(() => {
                const admin = JSON.parse(localStorage.getItem('user'));
                this.loadReservations(admin.id);
            })
            .catch(err => {
                console.error("Error marking reservation as completed:", err);
            });
    }

    render() {
        const { reservations } = this.state;

        return (
            <div className="container">
                <h2>Available Reservations</h2>
                <div className="row">
                    {reservations.map((reservation) => (
                        <div className="card col-md-4" key={reservation.id}>
                            <div className="card-body">
                                <h5 className="card-title">{reservation.name} {reservation.lastName}</h5>
                                <p className="card-text">Starting Time: {new Date(reservation.startingTime).toLocaleString()}</p>
                                <p className="card-text">Duration: {reservation.durationMinutes} minutes</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => this.MarkCompleted(reservation.id)}>
                                    Mark completed
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

CompanyAdminAvailableReservationsComponent.propTypes = {
    // Define prop types if necessary
};

export default CompanyAdminAvailableReservationsComponent;
