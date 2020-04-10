import React, {Component} from 'react';
import auth from '../../_services/Auth';
import { Link } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            email: "",
            password: "",
            loading: false
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

        const { email, password } = this.state;
        let data = {
            email,
            password
        }
        
        auth.login(
            data,
            () => {window.location.pathname = '/app'}
        );

        this.setState({
            email: "",
            password: ""
        }, ()=>{
            document.getElementById("login").reset();
        });
    }

    render(){
        const { email, password } = this.state;
        return(
            <div>
                <div className="card">
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
                                onClick={this.login.bind(this)}
                                className="btn btn-md btn-primary btn-block mb-3">دخول</button>
                        </form>
                    </div>
                </div>
                <p>ليس لديك حساب؟ <Link to={
                    {pathname: '/auth/signup', state: this.props.location.state}
                }>انشاء حساب جديد</Link></p>
            </div>
            
        )
    }
}

export default Login;