import React, { Component } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import ReservationService from '../services/ReservationService';
import { Redirect } from 'react-router-dom';
import CompanyAdminService from '../services/CompanyAdminService';

class CreatePredefinedReservation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDateTime: null,
            durationMinutes: '',
            adminId: '',
            companyId: props.match.params.id,
            user: JSON.parse(localStorage.getItem('user')) || {},
            admins: []  // Moved inside the state object
        };

        this.changeselectedDateTimeHandler = this.changeselectedDateTimeHandler.bind(this);
        this.changeDurationMinutesHandler = this.changeDurationMinutesHandler.bind(this);
        this.changeAdminIdHandler = this.changeAdminIdHandler.bind(this);
        this.saveReservation = this.saveReservation.bind(this);
    }

    async componentDidMount() {  // Added async here
        try {
            const response = await CompanyAdminService.getCompanyAdmins(this.state.companyId);
            const admins = response.data;
            this.setState({ 
                admins,
                adminId: admins.length > 0 ? admins[0].id : '' // Set first admin as the default selected value
            });
            console.log(this.state.admins);
        } catch (error) {
            console.error('Error fetching company admins:', error);
        }
    }

    changeDurationMinutesHandler = (event) => {
        this.setState({ durationMinutes: event.target.value });
    }

    changeselectedDateTimeHandler = (value) => {
        this.setState({ selectedDateTime: value });
        console.log("Selected date and time: " + value);
    }

    changeAdminIdHandler = (event) => {
        this.setState({ adminId: event.target.value });
    }

    saveReservation = async (e) => {
        e.preventDefault();

        if (this.state.selectedDateTime === null) {
            console.log('Warning: Starting date and time is empty.');
            return; 
        }

        let reservation = {
            selectedDateTime: this.state.selectedDateTime,
            durationMinutes: this.state.durationMinutes,
            adminId: this.state.adminId
        };
        console.log('reservation => ' + JSON.stringify(reservation));

        try {
            await ReservationService.CreatePredefinedReservation(reservation);
            this.props.history.push('/api/companies/' + this.state.companyId);
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    }

    render() { 
        const buttonStyle = {
            margin: '10px 0 0 0', // top right bottom left
        };
        const minDateTime = moment(); // Current date and time
    
        const { user } = this.state; 

        if (user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN')) {
            return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <div className='container'>
                        <div className='row'>
                            <div className='card col-md-6 offset-md-3'>
                                <h3 className='text-center'>Create Predefined Reservation</h3>
                                <div className='card-body'>
                                    <form>
                                        <div>
                                            <label>Duration (in minutes): </label>
                                            <input 
                                                name='durationMinutes' 
                                                className='form-control'
                                                value={this.state.durationMinutes} 
                                                onChange={this.changeDurationMinutesHandler}
                                            />
                                        </div>
                                        <div>
                                            <label>Select Company Admin:  </label>
                                            <select
                                                name='adminId'
                                                className='form-control'
                                                value={this.state.adminId}
                                                onChange={this.changeAdminIdHandler}>
                                                {this.state.admins.map(admin => (
                                                    <option key={admin.id} value={admin.id}>
                                                        {admin.firstName} {admin.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label>Select Date and Time:</label>
                                            <DateTimePicker
                                                value={this.state.selectedDateTime}
                                                onChange={this.changeselectedDateTimeHandler}
                                                minDateTime={minDateTime}
                                                renderInput={(props) => (
                                                    <input
                                                        {...props}
                                                        type="text"
                                                        placeholder="Select Date and Time"
                                                        className="form-control"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <button 
                                            className='btn btn-success' 
                                            onClick={this.saveReservation} 
                                            style={buttonStyle}>
                                            Save
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </LocalizationProvider>
            );
        } else {
            return <Redirect to="/api/companies" />;
        }
    }
}

export default CreatePredefinedReservation;
