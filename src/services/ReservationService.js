import axios from 'axios';
const RESERVATION_API_BASE_URL = "http://localhost:8082/api/reservations" ;

class ReservationService{
    
    getReservationByDate(date, showWeek){
        return axios.get(`${RESERVATION_API_BASE_URL}?date=${date}&week=${showWeek}`);
    }

    getReservationDaysByMonthAndYear(date){
        return axios.get(`${RESERVATION_API_BASE_URL}/month-overview?date=${date}`);
    }

}
export default new ReservationService();