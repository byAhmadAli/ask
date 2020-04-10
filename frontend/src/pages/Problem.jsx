import React, {Component} from 'react';
import Emoji from '../components/emoji';
import client from '../_utils/Client';
import Loading from '../components/loading';
import PostCard from '../components/post-card';

class Problem extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems: null,
            answers: [],
            loading: true,
            loadingAnswers: true,
            feeling: "😶",
            description: ""
        }
    }

    componentDidMount(){
        this.getProblem();
        this.getAnswers();
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
        let { statusFeeling, description } = this.state;
        let data = {
            feeling: statusFeeling,
            description
        }

        client.post(`${process.env.REACT_APP_API_URL}/problems/${id}/create/answer`, data)
        .then(res => {
            this.getAnswers();
            this.setState({
                statusFeeling: "😶",
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

    deleteProblem(){
        const { id } = this.props.match.params;
        client.patch(`${process.env.REACT_APP_API_URL}/problems/${id}/delete`)
        .then(res => {
            this.props.history.push(`/app/problems`);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    deleteAnswer(id){
        client.patch(`${process.env.REACT_APP_API_URL}/answers/${id}/delete`)
        .then(res => {
            this.getAnswers();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { problem, loading, loadingAnswers, answers, feeling, description } = this.state;
        const { profile } = this.props;
        
        return(
            <div>
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
                                        <PostCard item={problem} />
                                    </div>
                                </div>
                                {profile && profile.role.includes('ADMIN') &&
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button 
                                                onClick={this.deleteProblem.bind(this)}
                                                className="btn btn-md btn-danger float-left mb-3">حذف</button>
                                        </div>
                                    </div>
                                }
                                {!problem.assigned && profile && profile.role.includes('HELPER') &&
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button 
                                                onClick={this.assigned.bind(this)}
                                                className="btn btn-md btn-primary float-left mb-3">خصصها لي</button>
                                        </div>
                                    </div>
                                }
                                {problem.assigned && problem.status !== 'RESOLVED' && 
                                profile && profile.role.includes('USER') &&
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
                                                                <div className="clearfix">
                                                                    <div className="feeling">
                                                                        {item.feeling}
                                                                    </div>
                                                                    <div className="description">
                                                                        <h5 className="card-title">{item.who}</h5>
                                                                        <p className="card-text">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                                {profile && profile.role.includes('ADMIN') &&
                                                                    <div>
                                                                        <hr />
                                                                        <button 
                                                                            onClick={this.deleteAnswer.bind(this, item.id)}
                                                                            className="btn btn-md btn-danger float-left mb-3">حذف</button>
                                                                    </div>
                                                                }
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
                                            <div className="card status">
                                                <form id="comment">
                                                    <div className="form-group">
                                                        <textarea 
                                                            onChange={this.onChange.bind(this)}
                                                            name="description"
                                                            defaultValue={description}
                                                            className="form-control" id="inputDes" rows="3" placeholder="اكتب تعليقاً..."
                                                        ></textarea>
                                                        <div className="feeling">
                                                            <Emoji 
                                                                group="status"
                                                                onChange={this.onChange.bind(this)} />
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <hr />
                                                        <button 
                                                            onClick={this.createAnswer.bind(this)}
                                                            className="btn btn-md btn-primary btn-block mb-3">ارسل</button>
                                                    </div>
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
        )
    }
}

export default Problem;