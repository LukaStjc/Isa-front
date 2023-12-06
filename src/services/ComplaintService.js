import axios from 'axios';

const COMPLAINT_API_BASE_URL = "http://localhost:8082/api/complaints";

class ComplaintService{

    getAll(){
        return axios.get(COMPLAINT_API_BASE_URL);
    }

}
export default new ComplaintService();