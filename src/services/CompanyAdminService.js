import axios from 'axios';
const COMPANY_ADMIN_API_BASE_URL = "http://localhost:8082/api/company-admins" ;

class CompanyService{

    createCompanyAdmin(CompanyAdminDTO){
        return axios.post(`${COMPANY_ADMIN_API_BASE_URL}/create`, CompanyAdminDTO)
    }

    

}
export default new CompanyService();