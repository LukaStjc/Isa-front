
import axios from 'axios';
const COMPANY_API_BASE_URL = "http://localhost:8082/api/companies" ;

class CompanyService{
    getCompanies(){
        return axios.get(COMPANY_API_BASE_URL)
        
    }
    getCompanyById(companyId){
        return axios.get(COMPANY_API_BASE_URL + '/' + companyId);
    }
    
    createCompany(CompanyLocationDTO){
        return axios.post(COMPANY_API_BASE_URL, CompanyLocationDTO)
    }

    searchCompanies(searchText) {
        const url = `${COMPANY_API_BASE_URL}/search?text=${searchText}`;
        return axios.get(url);
    }

    getCompanyNames(){
        return axios.get(`${COMPANY_API_BASE_URL}/names`)
    }

    findByName(companyName){
        return axios.get(`${COMPANY_API_BASE_URL}/has-name?name=${companyName}`)
    }
}
export default new CompanyService();