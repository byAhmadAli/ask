import React, {Component} from 'react';
import Emoji from './emoji';
import { Link } from 'react-router-dom';
import Loading from './loading';
import client from '../_utils/Client';
import auth from '../_services/Auth';

class StatusCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            problemTypes: [],
            loading: true,
            statusFeeling: "😶",
            description: "",
            type: "other"
        }
    }

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

    createProblem(e){
        e.preventDefault();
        let { statusFeeling, description, type } = this.state;
        let data = {
            feeling: statusFeeling,
            description,
            type
        }

        client.post(`${process.env.REACT_APP_API_URL}/create/problem`, data)
        .then(res => {
            this.props.history.push(`/app/problems/${res.data.problem_id}`);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    render(){
        const { problemTypes, loading, feeling, description, type } = this.state;
        
        return (
            <div>
                <div className="card status">
                    <div className="form-group">
                        <textarea 
                            onChange={this.onChange.bind(this)}
                            name="description"
                            defaultValue={description}
                            className="form-control" id="inputDes" rows="3" placeholder="عبّر عن شعورك اليوم؟"
                        ></textarea>
                        <div className="feeling">
                            <Emoji 
                                group="status"
                                onChange={this.onChange.bind(this)} />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <hr />
                        {loading ? (
                            <div className="row mb-3">
                                <Loading color="primary" status="wait" />
                            </div>
                        ) : (
                            <div>
                                <div className="ask-radio-button-wrapper">
                                    {problemTypes.map((item, i) => {
                                        return (
                                            <span key={i}>
                                                <input 
                                                    type="radio" 
                                                    className="ask-radio-button" 
                                                    name="type" 
                                                    value={item._id} 
                                                    id={`category-${i}`} 
                                                    onChange={this.onChange.bind(this)}
                                                    defaultChecked={item.type === 'غير ذلك'}
                                                />
                                                <label htmlFor={`category-${i}`}>{item.type}</label>
                                            </span>
                                        );
                                    })}
                                </div>
                                <hr />
                                {auth.isAuthenticated() ? (
                                    <button 
                                        disabled={!description}
                                        onClick={this.createProblem.bind(this)}
                                        className="btn btn-md btn-primary btn-block mb-3">ارسل</button>
                                ) : (
                                    <Link  to={
                                        {pathname: '/auth/signup', state: {feeling, description, type}}
                                    } className={`btn btn-md btn-primary btn-block mb-3 ${!description && 'disabled'}`}>ارسل</Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {!auth.isAuthenticated() && 
                    <p>لديك حساب؟ <Link to='/auth/login'>تسجيل دخول</Link></p>
                }
            </div>
        );
    }
    
}

export default StatusCard;
