import React, { Component } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import ReservationService from '../services/ReservationService';
import CompanyAdminService from '../services/CompanyAdminService';
import { jsx } from '@emotion/react';

class CalendarViewWorkingDaysComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            selectedDate: dayjs(),
            reservations: [],
            showTable: false,
            reservedDays: [],
            id: 0,
            showCalendar: false
        }

        this.changeDatesHandler = this.changeDatesHandler.bind(this);
        this.handleMonthAndYearChange = this.handleMonthAndYearChange.bind(this);
        this.renderDay = this.renderDay.bind(this);
        this.handleIdChange = this.handleIdChange.bind(this);
    }

    renderDay(props){
        const {highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

        const isHighlighted = this.state.reservedDays.includes(props.day.date());

        return (
            <Badge
              key={props.day.toString()}
              overlap="circular"
              badgeContent={isHighlighted ? '🌚' : undefined}
            >
              <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
            </Badge>
          );
    }

    /*async UNSAFE_componentWillMount(){
        const formattedDate = this.state.selectedDate.format('YYYY-MM-DD');
        const res = await ReservationService.getReservationDaysByMonthAndYear(formattedDate, this.state.id);
    
        const reservedDays = res.data;
    
        this.setState({ reservedDays });
    }*/

    async umestoUCWM(){
        const answer = await CompanyAdminService.doesExsist(this.state.id);
        if(answer.data === false){
            console.log("Not a valid id");
            return;
        }

        const formattedDate = this.state.selectedDate.format('YYYY-MM-DD');
        const res = await ReservationService.getReservationDaysByMonthAndYear(formattedDate, this.state.id);
    
        const reservedDays = res.data;
    
        this.setState({ reservedDays, showCalendar: true });
    }

    async handleMonthAndYearChange(newDate){
        const formattedDate = newDate.format('YYYY-MM-DD');

        const res = await ReservationService.getReservationDaysByMonthAndYear(formattedDate, this.state.id);

        const reservedDays = res.data;

        this.setState({ reservedDays });
    }

    changeDatesHandler=(newDate) =>{
        this.setState({selectedDate: newDate});
    }

    async viewReservations() {
        this.setState({ showTable: true });
    
        const formattedDate = this.state.selectedDate.toISOString();
        const res = await ReservationService.getReservationByDate(formattedDate, 0, this.state.id);
        this.setState({ reservations: res.data });
    }
    
    async viewReservationsByWeek() {
        this.setState({ showTable: true });
    
        const formattedDate = this.state.selectedDate.toISOString();
        const res = await ReservationService.getReservationByDate(formattedDate, 1, this.state.id);
        this.setState({ reservations: res.data });
    }

    handleIdChange=(e) =>{
        this.setState({id: e.target.value});
    }



    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h2 className='text-center' style={{marginBottom: '30px'}}>Working calendar of your company</h2>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
                    <input
                    type="number"
                    value={this.state.id}
                    onChange={this.handleIdChange}
                    style={{ marginRight: '10px' }}
                    />

                    <button onClick={() => this.umestoUCWM()} className='btn btn-success'>Confirm</button>
                </div>

                {this.state.showCalendar && (
                    <>
                    <DateCalendar 
                        value={this.state.selectedDate} 
                        onChange={this.changeDatesHandler} 
                        onMonthChange={this.handleMonthAndYearChange}
                        onYearChange={this.handleMonthAndYearChange} 
                        slots={{
                            day: this.renderDay
                        }}
                        slotProps={{
                            day: this.state.reservedDays
                        }}
                    />
                
                    <div className='form-group d-flex justify-content-between col-md-6 offset-md-3 offset-md-3'>
                        <button onClick={() => this.viewReservations()} >Select Day</button>
                        <button onClick={() => this.viewReservationsByWeek()} >Select week</button>
                    </div>
                    </>
                )}
                {this.state.showTable && (
                    <table className='table table-striped table-bordered' style={{marginTop: '100px'}}>
                        <thead>
                            <tr>
                                <th>Beginning of appointment</th>
                                <th>Appointment duration minutes</th>
                                <th>Appointment creator name</th>
                                <th>Appointment creator last name</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{new Date(reservation.startingTime).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
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