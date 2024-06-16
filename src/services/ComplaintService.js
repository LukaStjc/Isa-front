import axios from 'axios';
import authHeader from './auth-header';

const COMPLAINT_API_BASE_URL = "http://localhost:8082/api/complaints";

class ComplaintService{

    getAll(){
        return axios.get(COMPLAINT_API_BASE_URL, {headers: authHeader()});
    }

    saveReply(reply, id){
        let object = {reply: reply, id: 7}
        axios.put(`${COMPLAINT_API_BASE_URL}/reply/${id}`, object, {headers: authHeader()});
    }

}
export default new ComplaintService();