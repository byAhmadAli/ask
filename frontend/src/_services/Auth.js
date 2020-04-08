import client from '../_utils/Client';

class Auth{
    constructor(){
        this.authenticated = localStorage.getItem('token') ? true : false;
    }

    login(user, cb){
        client.post(`${process.env.REACT_APP_API_URL}/users/login`,  user)
        .then(res => {
            client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            localStorage.setItem('token', res.data.token);
            cb();
        })
        .catch((error) => {
            localStorage.removeItem('token') 
            this.handleErrors(error);
        });
    }

    signup(user, cb){
        client.post(`${process.env.REACT_APP_API_URL}/user/create`,  user)
        .then(res => {
            client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            localStorage.setItem('token', res.data.token);
            cb();
        })
        .catch((error) => {
            localStorage.removeItem('token') 
            this.handleErrors(error);
        });
    }

    logout(cb){
        localStorage.removeItem('token');
        client.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        cb();
    }

    handleErrors(error){
        console.log(error)
    }

    checkAuthenticated(){
        client.get(`${process.env.REACT_APP_API_URL}/is-authenticated`)
        .then(res => {
            this.authenticated = res.data;
        })
        .catch((error) => {
            localStorage.removeItem('token') 
            this.authenticated = false;
        });
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth();