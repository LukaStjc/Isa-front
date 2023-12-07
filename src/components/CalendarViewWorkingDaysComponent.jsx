import React, { Component } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import CompanyAdminService from '../services/CompanyAdminService';

const currentDate = dayjs();

class CalendarViewWorkingDaysComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            selectedDate: null
        }
    }


    componentDidMount() {

    }

    

    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h2 className='text-center' style={{marginBottom: '30px'}}>Working calendar of your company</h2>
                <DateCalendar defaultValue={currentDate} />
            </LocalizationProvider>
        );
    }
}
export default CalendarViewWorkingDaysComponent;