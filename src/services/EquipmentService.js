import axios from 'axios';
import authHeader from './auth-header';

const EQUIPMENT_API_BASE_URL = 'http://localhost:8082/api/equipment';

class EquipmentService {
  constructor() {
    this.EQUIPMENT_COMPANY_API_BASE_URL = "http://localhost:8082/api/equipment/company";
  }

  getCompanyEquipment(id) {
    const url = id ? `${this.EQUIPMENT_COMPANY_API_BASE_URL}/${id}` : this.EQUIPMENT_COMPANY_API_BASE_URL;
    
    return axios.get(url);
  }

  getEquipment() {
    return axios.get(EQUIPMENT_API_BASE_URL);
  }

  searchEquipment(searchText) {
    const url = `${EQUIPMENT_API_BASE_URL}/search?text=${searchText}`;
    return axios.get(url);
  }
  createEquipment(equipmentDTO){
    return axios.post(EQUIPMENT_API_BASE_URL,  equipmentDTO, { headers: authHeader() }).catch(error => {
      console.error('Error updating company:', error);
      if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
      }
  });
}
  updateEquipment(equipmentId, equipmentDTO){
    return axios.put(EQUIPMENT_API_BASE_URL+ '/update/' + equipmentId, equipmentDTO, { headers: authHeader() }).catch(error => {
      console.error('Error updating company:', error);
      if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
      }
  });
}
  deleteEquipment(equipmentId){
    return axios.delete(EQUIPMENT_API_BASE_URL+ '/' + equipmentId)
  }
  
  getEquipmentById(id){
    return axios.get(EQUIPMENT_API_BASE_URL + "/" + id)
  }
  getEquipmentTypes(){
    return axios.get(EQUIPMENT_API_BASE_URL + "/get-types")
    
  }
}

export default new EquipmentService();
