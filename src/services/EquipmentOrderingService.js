import axios from 'axios';

const EQUIPMENT_ORDERING_API_BASE_URL = 'http://localhost:8082/api/equipment/ordering';

class EquipmentOrderingService {

  getEquipmentBasic(){
    return axios.get(EQUIPMENT_ORDERING_API_BASE_URL);
  }

  searchEquipmentBasic(name){
    return axios.get(`${EQUIPMENT_ORDERING_API_BASE_URL}/search?name=${name}`);
  }

}

export default new EquipmentOrderingService();
