import React, {Component} from 'react';
import Emoji from './emoji';
import { Link } from 'react-router-dom';
import Loading from './loading';
import client from '../_utils/Client';

class StatusCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            problemTypes: [],
            loading: true,
            feeling: "",
            description: "",
            type: ""
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
    
    render(){
        const { problemTypes, loading, feeling, description, type } = this.state;
        
        return (
            <div className="card status">
                <div className="form-group">
                    <div className="feeling">
                        <Emoji 
                            name="feeling"
                            defaultValue={feeling}
                            onChange={this.onChange.bind(this)} />
                    </div>
                    <textarea 
                        onChange={this.onChange.bind(this)}
                        name="description"
                        defaultValue={description}
                        className="form-control" id="inputDes" rows="3" placeholder="عبّر عن شعورك اليوم؟"
                    ></textarea>
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
                                                name="problemType" 
                                                value={item._id} 
                                                id={`problem-type-${i}`} 
                                            />
                                            <label htmlFor={`problem-type-${i}`}>{item.type}</label>
                                        </span>
                                    );
                                })}
                            </div>
                            <hr />
                            <Link to={
                                {pathname: '/signup', state: {feeling, description, type}}
                            } className="btn btn-md btn-primary btn-block mb-3">ارسل</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
}

export default StatusCard;
