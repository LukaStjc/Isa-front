import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getCompanyAdminBoard() {
    return axios.get(API_URL + 'company-admin', { headers: authHeader() });
  }

  getSystemAdminBoard() {
    return axios.get(API_URL + 'system-admin', { headers: authHeader() });
  }
}

export default new UserService();
