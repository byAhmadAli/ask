import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import client from '../../_utils/Client';
import Loading from '../../components/loading';

class Login extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            email: "",
            password: "",
            loading: false,
            error: ""
        }
    }

    onChange(e){
        let {value, name} = e.target;
        
        this.setState({
            [name]: value
        });        
    }

    login(e){
        e.preventDefault();

        this.setState({
            loading: true
        });

        const { email, password } = this.state;
        let data = {
            email,
            password
        }

        client.post(`${process.env.REACT_APP_API_URL}/users/login`,  data)
        .then(res => {
            client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            localStorage.setItem('token', res.data.token);
            
            window.location.pathname = '/app';
        })
        .catch((error) => {
            localStorage.removeItem('token') 

            this.setState({
                email: "",
                password: "",
                loading: false,
                error: error.response.data.error.message
            }, ()=>{
                document.getElementById("login").reset();
            });
        });
    }

    render(){
        const { email, password, error, loading } = this.state;
        return(
            <div>
                {error && 
                    <div className="alert alert-danger" role="alert">{error}</div>
                }
                <div className="card">
                    {loading ? (
                        <div className="card-body">
                            <div className="row">
                                <Loading color="primary" status="wait" />
                            </div>
                        </div>
                    ) : (
                        <div className="card-body">
                            <h5 className="card-title">تسجيل دخول</h5>
                            <form id="login">
                                <div className="form-group floating-label">
                                    <input 
                                        onChange={this.onChange.bind(this)}
                                        name="email"
                                        defaultValue={email}
                                        type="text" 
                                        id="inputEmail" 
                                        className="form-control" 
                                        placeholder="بريد الالكتروني / الاسم المستعار" 
                                        required="" 
                                    />
                                    <label forhtml="inputEmail">بريد الالكتروني / الاسم المستعار</label>
                                </div>
                                
                                <div className="form-group floating-label">
                                    <input 
                                        onChange={this.onChange.bind(this)}
                                        name="password"
                                        defaultValue={password}
                                        type="password" 
                                        id="inputPassword" 
                                        className="form-control" 
                                        placeholder="كلمة المرور" 
                                        required="" 
                                    />
                                    <label forhtml="inputPassword">كلمة المرور</label>
                                </div>
                                <hr />
                                <button 
                                    disabled={(!email || !password)}
                                    onClick={this.login.bind(this)}
                                    className="btn btn-md btn-primary btn-block mb-3">دخول</button>
                            </form>
                        </div>
                    )}
                    
                </div>
                <p>ليس لديك حساب؟ <Link to={
                    {pathname: '/auth/signup', state: this.props.location.state}
                }>انشاء حساب جديد</Link></p>
            </div>
            
        )
    }
}

export default Login;