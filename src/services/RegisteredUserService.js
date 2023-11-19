import axios from 'axios';

const REGISTERED_USER_API_BASE_URL = "http://localhost:8082/api";

class RegisteredUserService {
  createUser(RegisteredUserDTO) {
    return axios.post(`${REGISTERED_USER_API_BASE_URL}/signup`, RegisteredUserDTO);
  }
}

const registeredUserServiceInstance = new RegisteredUserService();
export default registeredUserServiceInstance;
