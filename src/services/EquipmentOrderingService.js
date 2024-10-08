import axios from 'axios';

const EQUIPMENT_ORDERING_API_BASE_URL = 'http://localhost:8082/api/equipment/ordering';

class EquipmentOrderingService {

  getEquipmentBasic(){
    return axios.get(EQUIPMENT_ORDERING_API_BASE_URL);
  }

  searchEquipmentBasic(name, type, score){
    //console.log(typeof score);
    return axios.get(`${EQUIPMENT_ORDERING_API_BASE_URL}/search?name=${name}&type=${type}&score=${score}`);
  }

}

export default new EquipmentOrderingService();
