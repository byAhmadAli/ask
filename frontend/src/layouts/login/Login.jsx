import React, {Component} from 'react';
import loginImg from './login.svg';
import auth from '../../_services/Auth';
import { Redirect, Link } from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            email: null,
            password: null
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
            email: null,
            password: null
        }); 
    }

    render(){
        const { email, password } = this.state;
        return(
            <div className="auth-layout">
                <div className="col-xs-12 col-md-4">
                    <div className="row">
                        <form className="form-signin">
                            <h1 className="mb-3 font-weight-normal">
                                <Link to="/">فضفض</Link>
                            </h1>
                            <h3>تسجيل دخول</h3>
                            <label forhtml="inputEmail" className="sr-only">بريد الالكتروني \ الاسم المستعار</label>
                            <input 
                                onChange={this.onChange.bind(this)}
                                name="email"
                                defaultValue={email}
                                type="text" id="inputEmail" className="form-control" placeholder="بريد الالكتروني \ الاسم المستعار" required="" />
                            <label forhtml="inputPassword" className="sr-only">كلمة المرور</label>
                            <input 
                                onChange={this.onChange.bind(this)}
                                name="password"
                                defaultValue={password}
                                type="password" id="inputPassword" className="form-control" placeholder="كلمة المرور" required="" />
                            <button 
                                onClick={this.login.bind(this)}
                                className="btn btn-md btn-primary btn-block mb-3">دخول</button>
                            <p>ليس لديك حساب؟ <Link to={
                                    {pathname: '/signup', state: this.props.location.state}
                                }>انشاء حساب جديد</Link></p>
                            
                            
                            <p className="mt-5 mb-3 text-muted">© 2020 فضفض</p>
                        </form>
                    </div>
                </div>
                <div className="col-md-8 auth-img d-none d-sm-block">
                    <img src={loginImg} alt="login" />
                </div>
                {this.isAuthenticated()}
            </div>
            
        )
    }
}

export default Login;