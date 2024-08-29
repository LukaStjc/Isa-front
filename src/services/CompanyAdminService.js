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
    
    doesExsist(id){
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/exsists/${id}`);
    }
    
    getCompanyIdBy(adminId) {
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/company/${adminId}`);
    }   
    getCompanyAdmins(companyId){
        return axios.get(`${COMPANY_ADMIN_API_BASE_URL}/all/${companyId}`)
    }
    changePassword(changePasswordDTO){
        return axios.put(`${COMPANY_ADMIN_API_BASE_URL}/change-password`, changePasswordDTO)
    }
}
export default new CompanyAdminService();