import axios from 'axios';
import authHeader from './auth-header';
const COMPANY_ADMIN_API_BASE_URL = "http://localhost:8082/api/company-admins" ;

class CompanyAdminService{

    createCompanyAdmin(CompanyAdminDTO){
        return axios.post(COMPANY_ADMIN_API_BASE_URL + '/create', CompanyAdminDTO, {headers: authHeader()});
    }

    findBy(id){
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/` + id);
    }
    updateCompanyAdmin(id, CompanyAdminDTO){
        return axios.put(`${COMPANY_ADMIN_API_BASE_URL}/update/` + id, CompanyAdminDTO);

    }
    
    doesExsist(id){
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/exsists/${id}`);
    }

}
export default new CompanyAdminService();