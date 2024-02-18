import axios from 'axios';
import authHeader from './auth-header'

const RESERVATION_API_BASE_URL = "http://localhost:8082/api/reservations" ;

class ReservationService{
    
    getReservationByDate(date, showWeek, id){
        return axios.get(`${RESERVATION_API_BASE_URL}/${id}?date=${date}&week=${showWeek}`);
    }

    getReservationDaysByMonthAndYear(date, id){
        return axios.get(`${RESERVATION_API_BASE_URL}/month-overview/${id}?date=${date}`);
    }
    
    CreatePredefinedReservation(reservationDTO){
        return axios.post(RESERVATION_API_BASE_URL, reservationDTO);
    }

    createReservation(reservationByPremadeAppointmentDTO) { // Vasilije
        return axios.post(RESERVATION_API_BASE_URL + '/create-by-premade-appointment', reservationByPremadeAppointmentDTO, { headers: authHeader() })
    }

}
export default new ReservationService();