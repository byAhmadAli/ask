import React, {Component} from 'react';
import signupImg from './signup.svg';
import auth from '../../_services/Auth';
import { Redirect, Link } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props)
        
        this.state = {
            email: "",
            password: ""
        }
    }

    isAuthenticated () {
        return auth.isAuthenticated() ? <Redirect from="/login" to="/app" /> : null
    };

    onChange(e){
        let {value, name} = e.target;
        
        this.setState({
            [name]: value
        });        
    }

    signup(e){
        e.preventDefault();

        const { email, password } = this.state;
        let data = {
            email,
            password
        }
        
        auth.signup(
            data,
            () => {window.location.pathname = '/app'}
        );

        this.setState({
            email: "",
            password: ""
        }, ()=>{
            document.getElementById("signup").reset();
        });
    }

    render(){
        const { email, password } = this.state;
        return(
            <div className="auth-layout">
                <div className="col-xs-12 col-md-4">
                    <div className="row">
                        <form id="signup" className="form-signin">
                            <h1 className="mb-3 font-weight-normal">
                                <Link to="/">فضفض</Link>
                            </h1>
                            <h3>انشاء حساب جديد</h3>
                            <label forhtml="inputEmail" className="sr-only">بريد الالكتروني</label>
                            <input 
                                onChange={this.onChange.bind(this)}
                                name="email"
                                defaultValue={email}
                                type="email" id="inputEmail" className="form-control" placeholder="بريد الالكتروني" required="" />
                            <label forhtml="inputPassword" className="sr-only">كلمة المرور</label>
                            <input 
                                onChange={this.onChange.bind(this)}
                                name="password"
                                defaultValue={password}
                                type="password" id="inputPassword" className="form-control" placeholder="كلمة المرور" required="" />
                            <p>
                                بالنقر على تسجيل، فانا اوافق على سياسية خصوصية فضفض وشروط الاستخدام
                            </p>
                            <button 
                                onClick={this.signup.bind(this)}
                                className="btn btn-md btn-primary btn-block mb-3">تسجيل</button>
                            <p>لديك حساب؟ <Link to={
                                    {pathname: '/login', state: this.props.location.state}
                                }>تسجيل دخول</Link></p>
                            
                            
                            <p className="mt-5 mb-3 text-muted">© 2020 فضفض</p>
                        </form>
                    </div>
                </div>
                <div className="col-md-8 auth-img d-none d-sm-block">
                    <img src={signupImg} alt="signup" />
                </div>
                {this.isAuthenticated()}
            </div>
            
        )
    }
}

export default Login;