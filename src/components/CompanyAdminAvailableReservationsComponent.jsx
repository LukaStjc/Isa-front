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



    MarkCompleted = async (reservationId) => {
        try {
            // Set a timeout to delay the execution of the marking process
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for 3 seconds
    
            // Call the service to mark the reservation as completed
            await ReservationService.markReservationCompleted(reservationId);
    
            // After marking it as completed, reload the reservations
            const admin = JSON.parse(localStorage.getItem('user'));
            await this.loadReservations(admin.id);
    
            // Notify the user of the successful operation
            alert('Reservation marked as completed successfully.');
        } catch (err) {
            // Handle potential conflicts or other errors
            if (err.response && err.response.status === 409) {
                alert('You are not able to complete this reservation. Please try again later.');
            } else if (err.response && err.response.status === 400) {
                // Check if the error message contains the specific issue with insufficient equipment or time check
                const errorMessage = err.response.data.message;
    
                if (errorMessage && errorMessage.includes("hasn't started yet")) {
                    // Custom error when trying to complete a reservation that hasn't started yet
                    alert('The reservation cannot be marked as completed because it hasn\'t started yet.');
                } else {
                    alert(errorMessage || 'An error occurred due to insufficient equipment quantity. Please review your reservation and try again.');
                }
            } else {
                console.error("Error marking reservation as completed:", err);
                alert('An error occurred while marking the reservation as completed. Please try again.');
            }
        }
    }
    
    
    // MarkAllCompleted = async () => {
    //     const { reservations } = this.state;
    //     for (const reservation of reservations) {
    //         await this.MarkCompleted(reservation.id);
    //     }
    // }
    // SVE U ISTO FREME
    // MarkAllCompleted = async () => {
    //     const { reservations } = this.state;
    //     await Promise.all(reservations.map(reservation => this.MarkCompleted(reservation.id)));
    // }
    MarkAllCompleted = async () => {
        const { reservations } = this.state;
        try {
            await Promise.all(reservations.map(reservation => this.MarkCompleted(reservation.id)));
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Failed to complete all reservations. Please try again.");
            }
        }
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
                <button 
                    className="btn btn-success mt-3"
                    onClick={this.MarkAllCompleted}>
                    Mark All Completed
                </button>
            </div>
        );
    }
}


CompanyAdminAvailableReservationsComponent.propTypes = {
    // Define prop types if necessary
};

export default CompanyAdminAvailableReservationsComponent;
