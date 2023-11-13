import axios from 'axios';

const COMPANY_API_BASE_URL = "http://localhost:8082/api/companies" ;

class CompanyService{

    getCompanies(){
        return axios.get(COMPANY_API_BASE_URL, { withCredentials: true })
        
    }
}

export default new CompanyService();