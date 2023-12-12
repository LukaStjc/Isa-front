import React, { Component } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import ReservationService from '../services/ReservationService';

class CalendarViewWorkingDaysComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            selectedDate: dayjs(),
            reservations: [], // proveriti da li je ova lista null kad se dobavi od service
            showTable: false
        }

        this.changeDatesHandler = this.changeDatesHandler.bind(this);
    }

    changeDatesHandler=(newDate) =>{
        this.setState({selectedDate: newDate});
    }

    viewReservations(){
        this.setState({showTable: true});

        const formattedDate = this.state.selectedDate.toISOString();
        ReservationService.getReservationByDate(formattedDate).then((res) => {
            this.setState({reservations: res.data});
        });
    }

    viewReservationsByWeek(){

    }

    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h2 className='text-center' style={{marginBottom: '30px'}}>Working calendar of your company</h2>
                <DateCalendar value={this.state.selectedDate} onChange={this.changeDatesHandler}/>

                <div className='form-group d-flex justify-content-between col-md-6 offset-md-3 offset-md-3'>
                    <button onClick={() => this.viewReservations()} >Select Day</button>
                    <button onClick={() => this.viewReservationsByWeek()} >Select week</button>
                </div>
                
                {this.state.showTable && (
                    <table className='table table-striped table-bordered' style={{marginTop: '100px'}}>
                        <thead>
                            <tr>
                                <th>Beginning of appointment</th>
                                <th>Appointment duration</th>
                                <th>Appointment creator name</th>
                                <th>Appointment creator last name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.startingTime}</td>
                                    <td>{reservation.durationMinutes}</td>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.lastName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </LocalizationProvider>
        );
    }
}
export default CalendarViewWorkingDaysComponent;