import axios from 'axios';

const SYSTEM_ADMIN_API_BASE_URL = "http://localhost:8082/api/system-admins" ;

class SystemAdminService{

    createSystemAdmin(userDTO){
        return axios.post(`${SYSTEM_ADMIN_API_BASE_URL}/create`, userDTO);
    }

    updatePassword(userDTO){
        return axios.put(`${SYSTEM_ADMIN_API_BASE_URL}/update-password`, userDTO);
    }

    isCurrentPassword(password){
        return axios.get(`${SYSTEM_ADMIN_API_BASE_URL}/check-password?password=${password}`);
    }

}
export default new SystemAdminService();