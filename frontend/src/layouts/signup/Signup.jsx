import React, {Component} from 'react';
import auth from '../../_services/Auth';
import { Link } from 'react-router-dom';
import client from '../../_utils/Client';

const faker = require('faker');

class Signup extends Component{
    constructor(props){
        super(props)
        console.log(props.location.state)
        this.state = {
            email: "",
            password: "",
            nickname: "",
            error: ""
        }
    }

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/users/nickname`)
        .then(res => {
            this.setState({
                nickname: res.data.nickname
            })
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: error.response.data.error.message
            });
        });
    }

    onChange(e){
        let {value, name} = e.target;
        
        this.setState({
            [name]: value
        });        
    }

    signup(e){
        e.preventDefault();

        const { email, password, nickname } = this.state;
        let data = {
            email,
            password,
            nickname
        }
        
        client.post(`${process.env.REACT_APP_API_URL}/user/create`,  data)
        .then(res => {
            client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            localStorage.setItem('token', res.data.token);
            
            if(this.props.location.state){
                let { feeling, description, type } = this.props.location.state;
                let data = {
                    feeling,
                    description,
                    type
                }

                client.post(`${process.env.REACT_APP_API_URL}/problems/create`, data)
                .then(res => {
                    window.location.pathname = `/app/problems/show/${res.data.problem_id}`;
                })
                .catch((error) => {
                    console.log(error);
                    window.location.pathname = `/app`;
                });
            }else{
                window.location.pathname = `/app`;
            }
        })
        .catch((error) => {
            localStorage.removeItem('token');

            this.setState({
                email: "",
                password: "",
                error: error.response.data.error.message
            }, ()=>{
                document.getElementById("signup").reset();
            });
        });

        
    }

    render(){
        const { email, password, nickname, error } = this.state;
        return(
            <div>
                {error && 
                    <div className="alert alert-danger" role="alert">{error}</div>
                }
                <div className="form-signin">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">انشاء حساب جديد</h5>
                            <form id="signup">
                                <div className="form-group floating-label">
                                    <input 
                                        onChange={this.onChange.bind(this)}
                                        name="email"
                                        defaultValue={email}
                                        type="email" 
                                        id="inputEmail" 
                                        className="form-control" 
                                        placeholder="بريد الالكتروني" 
                                        required="" 
                                    />
                                    <label forhtml="inputEmail">بريد الالكتروني</label>
                                </div>
                                
                                <div className="form-group floating-label">
                                    <input 
                                        onChange={this.onChange.bind(this)}
                                        name="nickname"
                                        defaultValue={nickname}
                                        type="text" 
                                        id="inputNickname" 
                                        className="form-control" 
                                        placeholder="الاسم المستعار" 
                                        required="" 
                                        disabled={true}
                                    />
                                    <label forhtml="inputNickname">الاسم المستعار</label>
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

                                <p>
                                    بالنقر على تسجيل، فانا اوافق على سياسية خصوصية فضفض وشروط الاستخدام
                                </p>
                                <hr />
                                <button 
                                    disabled={(!email || !password)}
                                    onClick={this.signup.bind(this)}
                                    className="btn btn-md btn-primary btn-block mb-3">تسجيل</button>
                            </form>
                        </div>
                    </div>
                    <p>لديك حساب؟ <Link to={
                        {pathname: '/auth/login', state: this.props.location.state}
                    }>تسجيل دخول</Link></p>
                </div>
            </div>
        )
    }
}

export default Signup;