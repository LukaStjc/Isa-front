import axios from 'axios';
import authHeader from './auth-header';

const SYSTEM_ADMIN_API_BASE_URL = "http://localhost:8082/api/system-admins" ;

class SystemAdminService{

    createSystemAdmin(userDTO){
        return axios.post(`${SYSTEM_ADMIN_API_BASE_URL}/create`, userDTO, { headers: authHeader() });
    }

    updatePassword(userDTO){
        return axios.put(`${SYSTEM_ADMIN_API_BASE_URL}/update-password`, userDTO, { headers: authHeader() });
    }

    isCurrentPassword(password){
        return axios.get(`${SYSTEM_ADMIN_API_BASE_URL}/check-password?password=${password}`, { headers: authHeader() });
    }

}
export default new SystemAdminService();