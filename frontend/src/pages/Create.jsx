import React, {Component} from 'react';
import Emoji from '../components/emoji';
import client from '../_utils/Client';
import Loading from '../components/loading';

class Create extends Component{
    constructor(props){
        super(props);
        this.state = {
            problemTypes: null,
            loading: true,
            feeling: "😂",
            description: null,
            type: null
        }
    }

    componentDidMount(){
        const { profile, history } = this.props;
        if(profile && !profile.role.includes('USER')) history.push("/app");

        client.get(`${process.env.REACT_APP_API_URL}/users/profile`)
        .then(res => {
            this.setState({
                profile: res.data,
                profileLoaded: true
            })
        })
        .catch((error) => {
            console.log(error);
        });

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

        client.post(`${process.env.REACT_APP_API_URL}/create/problem`, data)
        .then(res => {
            this.props.history.push(`/app/problems/${res.data.problem_id}`)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { loading, feeling, description, problemTypes } = this.state;
        return(
            <div>
                <div className="head">
                    <div className="container">
                        <div className="col-md-12">
                            <h3>انشاء</h3>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div>
                        {loading ? (
                            <div className="row">
                                <Loading color="primary" status="wait" />
                            </div>
                        ) : (
                            <div className="row">
                                <form className="form-problem">                                        
                                    <div className="form-group">
                                        <label>تكلم هنا</label>
                                        <div className="ask-radio-button-wrapper">
                                            {problemTypes.map((item, i) => {
                                                return (
                                                    <span key={i}>
                                                        <input 
                                                            type="radio" 
                                                            className="ask-radio-button" 
                                                            name="type" 
                                                            value={item._id} 
                                                            id={`problem-type-${i}`} 
                                                            onChange={this.onChange.bind(this)}
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

                                    <button 
                                        onClick={this.createProblem.bind(this)}
                                        className="btn btn-md btn-primary btn-block mb-3">ارسل</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Create;