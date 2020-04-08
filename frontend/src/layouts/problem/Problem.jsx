import React, {Component} from 'react';
import problemImg from './problem.svg';
import Emoji from '../../components/emoji';
import client from '../../_utils/Client';
import Loading from '../../components/loading';
import { Link, Redirect } from 'react-router-dom';
import auth from '../../_services/Auth';
class Problem extends Component{
    constructor(props){
        super(props);
        this.state = {
            problemTypes: [],
            loading: true,
            feeling: "😂",
            description: null,
            type: null
        }
    }

    isAuthenticated () {
        return auth.isAuthenticated() ? <Redirect from="/" to="/app" /> : null
    };

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/problem/types`)
        .then(res => {
            this.setState({
                problemTypes: res.data,
                loading: false
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    onChange(e){
        let {value, name} = e.target;
        
        this.setState({
            [name]: value
        });        
    }

    render(){
        const { problemTypes, loading, feeling, description, type } = this.state;
        return(
            <div className="auth-layout">
                <div className="col-xs-12 col-md-4">
                    {loading ? (
                        <div className="row">
                            <Loading color="primary" status="wait" />
                        </div>
                    ) : (
                        <div className="row">
                            <form className="form-ask">
                                <h1 className="mb-3 font-weight-normal">
                                    <Link to="/">فضفض</Link>
                                </h1>
                                
                                <div className="form-group">
                                    <label>نوع المشكلة</label>
                                    <div className="ask-radio-button-wrapper">
                                        {problemTypes.map((item, i) => {
                                            return (
                                                <span key={i}>
                                                    <input 
                                                        type="radio" 
                                                        className="ask-radio-button" 
                                                        name="problemType" 
                                                        value={item._id} 
                                                        id={`problem-type-${i}`} 
                                                    />
                                                    <label htmlFor={`problem-type-${i}`}>{item.type}</label>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                
                                <div className="form-group">
                                    <label forhtml="inputDes">عبّر</label>
                                    <div className="input-group mb-2">
                                        <div className="input-group-prepend">
                                            <Emoji 
                                                name="feeling"
                                                defaultValue={feeling}
                                                onChange={this.onChange.bind(this)} />
                                        </div>
                                        <textarea 
                                            onChange={this.onChange.bind(this)}
                                            name="description"
                                            defaultValue={description}
                                            className="form-control" id="inputDes" rows="3" placeholder="بما تفكر؟"></textarea>
                                    </div>
                                </div>

                                <Link to={
                                    {pathname: '/signup', state: {feeling, description, type}}
                                } className="btn btn-md btn-primary btn-block mb-3">ارسل</Link>
                                <p>لديك حساب؟ <Link to="/login">تسجيل دخول</Link></p>
                                
                                <p className="mt-5 mb-3 text-muted">© 2020 فضفض</p>
                            </form>
                        </div>
                    )}
                    
                    
                </div>
                <div className="col-md-8 auth-img d-none d-sm-block">
                    <img src={problemImg} alt="problem" />
                </div>
                {this.isAuthenticated()}
            </div>
            
        )
    }
}

export default Problem;