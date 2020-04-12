import client from '../_utils/Client';

class Auth{
    constructor(){
        this.authenticated = localStorage.getItem('token') ? true : false;
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