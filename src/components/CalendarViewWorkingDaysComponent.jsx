import React, { Component } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import CompanyAdminService from '../services/CompanyAdminService';

class CalendarViewWorkingDaysComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            selectedDate: dayjs(),
            reservations: [],
            showTable: false
        }

        this.changeDatesHandler = this.changeDatesHandler.bind(this);
    }

    changeDatesHandler=(newDate) =>{
        this.setState({selectedDate: newDate});
    }

    viewSchedule(){
        this.setState({showTable: true});
    }

    render() {
        return (//TODO ukoliko u ponedeljak vidim da mi ne trebaju oba kalendara, treba izbrisati
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h2 className='text-center' style={{marginBottom: '30px'}}>Working calendar of your company</h2>
                <div className='form-group d-flex justify-content-between'>
                    <DateCalendar value={this.state.selectedDate} onChange={this.changeDatesHandler}/>
                    <DateCalendar
                        defaultValue={dayjs('2022-04-17')}
                        views={['month', 'year']}
                        openTo="month"
                    />
                </div>

                <button onClick={() => this.viewSchedule()} style={{marginLeft: '150px'}}>Select</button>

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
                                    <td>{reservation.duration}</td>
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