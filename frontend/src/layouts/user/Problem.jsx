import React, {Component} from 'react';
import Emoji from '../../components/emoji';
import client from '../../_utils/Client';
import Loading from '../../components/loading';
import MainMenu from '../../components/main-menu';
class Problem extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems: null,
            answers: [],
            loading: true,
            loadingAnswers: true,
            feeling: "😂",
            description: ""
        }
    }

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/users/profile`)
        .then(res => {
            this.setState({
                profile: res.data,
                profileLoaded: true
            }, () => {
                this.getProblem();
                this.getAnswers();
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getProblem(){
        const { id } = this.props.match.params;
        client.get(`${process.env.REACT_APP_API_URL}/problems/${id}`)
        .then(res => {
            this.setState({
                problem: res.data,
                loading: false
            })
        })
        .catch((error) => {
            console.log(error);
            
            if(error.request.status === 404) return window.location.pathname = '/app'
        });
    }

    getAnswers(){
        const { id } = this.props.match.params;
        this.setState({
            loadingAnswers: true
        })

        client.get(`${process.env.REACT_APP_API_URL}/problems/${id}/answers`)
        .then(res => {
            this.setState({
                answers: res.data,
                loadingAnswers: false
            });
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

    createAnswer(e){
        const { id } = this.props.match.params;
        e.preventDefault();
        let { feeling, description } = this.state;
        let data = {
            feeling,
            description
        }

        client.post(`${process.env.REACT_APP_API_URL}/problems/${id}/create/answer`, data)
        .then(res => {
            this.getAnswers();
            this.setState({
                feeling: "😂",
                description: ""
            }, () => {
                document.getElementById("comment").reset();
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    assigned(){
        const { id } = this.props.match.params;
        client.patch(`${process.env.REACT_APP_API_URL}/problems/${id}/assign`)
        .then(res => {
            this.getProblem();
            this.getAnswers();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    resolve(){
        const { id } = this.props.match.params;
        client.patch(`${process.env.REACT_APP_API_URL}/problem/${id}/resolved`)
        .then(res => {
            this.getProblem();
            this.getAnswers();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { problem, loading, loadingAnswers, answers, feeling, description, profile, profileLoaded } = this.state;
        let statusColor;
        
        if(!loading){
            if(problem.status === 'OPEN'){
                statusColor = "danger";
            }else if(problem.status === 'ACTIVE'){
                statusColor = "primary";
            }else if(problem.status === 'RESOLVED'){
                statusColor = "success";
            }else{
                statusColor = "secondary";
            }
        }
        
        return(
            <div className="app-layout">
                <div className="main-nav">
                    <MainMenu profileLoaded={profileLoaded} profile={profile} />
                </div>
                <div className="content">
                    <div className="head">
                        <div className="container">
                            <div className="col-md-12">
                                <h3>عرض المشكلة</h3>
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
                                <div>
                                    
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className={`badge badge-${statusColor}`}>{problem.status}</div>
                                                    <h5 className="card-title">{problem.feeling} - {problem.type}</h5>
                                                    <p className="card-text">{problem.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!problem.assigned && !problem.user && 
                                        <div className="row">
                                            <div className="col-md-12">
                                                <button 
                                                    onClick={this.assigned.bind(this)}
                                                    className="btn btn-md btn-primary float-left mb-3">خصصها لي</button>
                                            </div>
                                        </div>
                                    }
                                    {problem.assigned && problem.user && problem.status !== 'RESOLVED' &&
                                        <div className="row">
                                            <div className="col-md-12">
                                                <button 
                                                    onClick={this.resolve.bind(this)}
                                                    className="btn btn-md btn-success float-left mb-3">حل المشكلة</button>
                                            </div>
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h5>اجابات <span className="badge badge-primary">{answers.length}</span></h5>
                                        </div>
                                    </div>
                                    {loadingAnswers ? (
                                        <div className="row">
                                            <Loading color="primary" status="wait" />
                                        </div>
                                    ) : (
                                        <div className="answers">
                                            {answers.map((item, i) => {
                                                return(
                                                    <div key={i} className="row">
                                                        <div className="col-md-12">
                                                            <div className="card">
                                                                <div className="card-body">
                                                                    <div className="feeling">
                                                                        {item.feeling}
                                                                    </div>
                                                                    <div className="description">
                                                                        <h5 className="card-title">{item.who}</h5>
                                                                        <p className="card-text">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    <div className="row">
                                        {((problem.assigned && problem.helper) || problem.user) && problem.status !== 'RESOLVED' && 
                                            <div className="col-md-12">
                                                <div className="form-answer p-0">
                                                    <form id="comment">
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
                                                            onClick={this.createAnswer.bind(this)}
                                                            className="btn btn-md btn-primary btn-block mb-3">ارسل</button>
                                                    </form>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Problem;