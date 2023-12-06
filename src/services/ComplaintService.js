import axios from 'axios';

const COMPLAINT_API_BASE_URL = "http://localhost:8082/api/complaints";

class ComplaintService{

    getAll(){
        return axios.get(COMPLAINT_API_BASE_URL);
    }

    saveReply(reply, id){
        let object = {reply: reply}
        axios.put(`${COMPLAINT_API_BASE_URL}/reply/${id}`, object);
    }

}
export default new ComplaintService();