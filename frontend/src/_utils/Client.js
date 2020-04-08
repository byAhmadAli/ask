import axios from 'axios';

class Client{
    constructor(opt){
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return axios.create(opt);
    }
}
export default new Client();