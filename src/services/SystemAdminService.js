import axios from 'axios';

const SYSTEM_ADMIN_API_BASE_URL = "http://localhost:8082/api/system-admins" ;

class SystemAdminService{

    createSystemAdmin(userDTO){
        return axios.post(`${SYSTEM_ADMIN_API_BASE_URL}/create`, userDTO);
    }

}
export default new SystemAdminService();