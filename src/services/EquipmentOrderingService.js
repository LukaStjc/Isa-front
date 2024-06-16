import axios from 'axios';
import authHeader from './auth-header';

const EQUIPMENT_ORDERING_API_BASE_URL = 'http://localhost:8082/api/equipment/ordering';

class EquipmentOrderingService {

  getEquipmentBasic(){
    return axios.get(EQUIPMENT_ORDERING_API_BASE_URL);
  }

  searchEquipmentBasic(name, type, score){
    return axios.get(`${EQUIPMENT_ORDERING_API_BASE_URL}/search?name=${name}&type=${type}&score=${score}`, {headers: authHeader()});
  }

}

export default new EquipmentOrderingService();
