import axios from 'axios';
const COMPANY_ADMIN_API_BASE_URL = "http://localhost:8082/api/company-admins" ;

class CompanyAdminService{

    createCompanyAdmin(CompanyAdminDTO){
        return axios.post(`${COMPANY_ADMIN_API_BASE_URL}/create`, CompanyAdminDTO)
    }

    findBy(id){
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/` + id)
    }
    updateCompanyAdmin(id, CompanyAdminDTO){
        return axios.put(`${COMPANY_ADMIN_API_BASE_URL}/update/` + id, CompanyAdminDTO)

    }
    

}
export default new CompanyAdminService();