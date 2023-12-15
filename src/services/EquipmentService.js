import axios from 'axios';

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
    return axios.post(EQUIPMENT_API_BASE_URL, equipmentDTO)
  }
  updateEquipment(equipmentId, equipmentDTO){
    return axios.put(EQUIPMENT_API_BASE_URL+ '/update/' + equipmentId, equipmentDTO)
  }
  deleteEquipment(equipmentId){
    return axios.delete(EQUIPMENT_API_BASE_URL+ '/' + equipmentId)
  }
  
  getEquipmentById(id){
    return axios.get(EQUIPMENT_API_BASE_URL + "/" + id)
  }
}

export default new EquipmentService();
