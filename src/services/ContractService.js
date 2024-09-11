import axios from 'axios';
import authHeader from './auth-header';
const CONTRACT_API_BASE_URL = "http://localhost:8082/api/contracts" ;

class ContractService{
    
    findAllActive(companyId){
        return axios.get(CONTRACT_API_BASE_URL + "/" + companyId + "/active")
    }
    cancelDelivery(id){
        return axios.put(CONTRACT_API_BASE_URL + "/" + id + "/cancel-delivery")
    }
}
export default new ContractService();
