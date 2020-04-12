import React, {Component} from 'react';
import Emoji from './emoji';
import { Link } from 'react-router-dom';
import Loading from './loading';
import client from '../_utils/Client';
import auth from '../_services/Auth';

import {
    Card, CardBody, Row
} from 'reactstrap';

class StatusCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            problemTypes: [],
            loading: true,
            feeling: "😶",
            description: "",
            type: "other",
            error: ""
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
        let { feeling, description, type } = this.state;
        let data = {
            feeling,
            description,
            type
        }

        client.post(`${process.env.REACT_APP_API_URL}/problems/create`, data)
        .then(res => {
            this.props.history.push(`/app/problems/show/${res.data.problem_id}`);
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                error: error.response.data.error.message
            });
        });
    }
    
    render(){
        const { problemTypes, loading, feeling, description, type, error } = this.state;
        
        return (
            <div>
                {error && 
                    <div className="alert alert-danger" role="alert">{error}</div>
                }
                <Card className="status">
                    <CardBody>
                        <div className="form-group">
                            <textarea 
                                id="description"
                                onChange={this.onChange.bind(this)}
                                name="description"
                                defaultValue={description}
                                className="form-control" id="inputDes" rows="3" placeholder="عبّر عن شعورك اليوم؟"
                            ></textarea>
                        </div>
                        <div className="select-feeling">
                            <Emoji 
                                group="status"
                                onChange={this.onChange.bind(this)} />
                        </div>
                        <hr />
                        {loading ? (
                            <Row className="mb-3">
                                <Loading color="primary" status="wait" />
                            </Row>
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
                    </CardBody>
                </Card>
                {!auth.isAuthenticated() && 
                    <p>لديك حساب؟ <Link to='/auth/login'>تسجيل دخول</Link></p>
                }
            </div>
        );
    }
    
}

export default StatusCard;
