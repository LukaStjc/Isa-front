
import axios from 'axios';
const COMPANY_API_BASE_URL = "http://localhost:8082/api/companies" ;
class CompanyService{
    getCompanies(){
        return axios.get(COMPANY_API_BASE_URL)
        
    }
    
    createCompany(CompanyLocationDTO){
        return axios.post(COMPANY_API_BASE_URL, CompanyLocationDTO)
    }

    searchCompanies(searchText) {
        const url = `${COMPANY_API_BASE_URL}/search?text=${searchText}`;
        return axios.get(url);
      }
}
export default new CompanyService();