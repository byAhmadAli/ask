import React, {Component} from 'react';
import Emoji from '../components/emoji';
import client from '../_utils/Client';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import TextareaAutosize from 'react-textarea-autosize';

const moment = require('moment');
require("moment/locale/ar")

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
        const { id } = this.props.match.params;
        this.getProblem(id);
        this.getAnswers(id);
    }

    componentWillUpdate(np) {
        const { match } = this.props;
        const prevPostId = match.params.id;
        const nextPostId = np.match.params.id;
        
        if(nextPostId && prevPostId !== nextPostId){
            this.getProblem(nextPostId);
            this.getAnswers(nextPostId);
        }
    }

    getProblem(id){
        const { profile } = this.props;
        client.get(`${process.env.REACT_APP_API_URL}/problems/${id}`)
        .then(res => {
            if(profile && profile.role.includes('ADMIN')){
                this.setState({
                    problem: res.data.problem,
                    user_profile: res.data.creatorProfile,
                    helper_profile: res.data.helperProfile,
                    loading: false
                })
            }else{
                this.setState({
                    problem: res.data,
                    loading: false
                })
            }  
        })
        .catch((error) => {
            console.log(error);
            if(error.request.status === 404) return window.location.pathname = '/app'
        });
    }

    getAnswers(id){
        
        this.setState({
            loadingAnswers: true
        })

        client.get(`${process.env.REACT_APP_API_URL}/problems/${id}/answers`)
        .then(res => {
            this.setState({
                answers: res.data,
                loadingAnswers: false
            }, () => {
                if (document.querySelector('.end-of-chat')) {
                    document.querySelector('.end-of-chat').scrollIntoView();
                }
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
            this.getAnswers(id);
            this.setState({
                feeling: "😶",
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
            this.getProblem(id);
            this.getAnswers(id);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    resolve(){
        const { id } = this.props.match.params;
        client.patch(`${process.env.REACT_APP_API_URL}/problems/${id}/resolved`)
        .then(res => {
            this.getProblem(id);
            this.getAnswers(id);
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

    deleteAnswer(answersId){
        const { id } = this.props.match.params;
        client.patch(`${process.env.REACT_APP_API_URL}/answers/${answersId}/delete`)
        .then(res => {
            this.getAnswers(id);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { problem, loading, loadingAnswers, answers, description } = this.state;
        const { profile } = this.props;
        
        return(
            <div className="main main-visible">
                {loading ? (
                    <div className="chat flex-column justify-content-center text-center">
                        <div className="container-xxl">
                            <Loading color="primary" status="wait" />
                        </div>
                    </div>
                ) : (
                    <div className="chat">
                        <div className="chat-body">
                            <div className="chat-header border-bottom py-4 py-lg-6 px-lg-8">
                                <div className="container-xxl">

                                    <div className="row align-items-center">

                                        <div className="col-3 d-xl-none">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Link className="text-muted px-0" to="/app/problems">
                                                        <i className="icon-md fe-chevron-right"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="col-6 col-xl-6">
                                            <div className="media text-center text-xl-right">
                                                <div className="avatar avatar-sm d-none d-xl-inline-block ml-5">
                                                    <span className="avatar-img">{problem.feeling}</span>
                                                </div>

                                                <div className="media-body align-self-center text-truncate">
                                                    <h6 className="text-truncate mb-n1">{problem.type}</h6>
                                                    <small className="text-muted">بواسطة: {problem.profile.name}</small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-3 col-xl-6 text-left">
                                            <ul className="nav justify-content-end">
                                                {profile && profile.role.includes('ADMIN') &&
                                                    <li className="nav-item list-inline-item d-none d-xl-block ml-3">
                                                        <button 
                                                        onClick={this.deleteProblem.bind(this)}
                                                        className="btn btn-sm btn-danger float-left mb-3">حذف</button>
                                                    </li>
                                                }
                                                {!problem.assigned && profile && profile.role.includes('HELPER') &&
                                                    <li className="nav-item list-inline-item d-none d-xl-block ml-3">
                                                        <button 
                                                            onClick={this.assigned.bind(this)}
                                                            className="btn btn-sm btn-primary float-left mb-3">خصصها لي</button>
                                                    </li>
                                                }
                                                {problem.assigned && problem.status !== 'RESOLVED' && 
                                                profile && profile.role.includes('USER') &&
                                                    <li className="nav-item list-inline-item d-none d-xl-block ml-0">
                                                        <button 
                                                            onClick={this.resolve.bind(this)}
                                                            className="btn btn-sm btn-outline-success float-left mb-3">حل المشكلة</button>
                                                    </li>
                                                }

                                                <li className="nav-item list-inline-item d-block d-xl-none">
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle tag="a" className="nav-link text-muted px-0">
                                                            <i className="icon-md fe-more-vertical"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {profile && profile.role.includes('ADMIN') &&
                                                                <DropdownItem onClick={this.deleteProblem.bind(this)} className="dropdown-item d-flex align-items-center" tag="a" href="#">
                                                                    حذف
                                                                </DropdownItem>
                                                            }
                                                            {!problem.assigned && profile && profile.role.includes('HELPER') &&
                                                                <DropdownItem onClick={this.assigned.bind(this)} className="dropdown-item d-flex align-items-center" tag="a" href="#">
                                                                    خصصها لي
                                                                </DropdownItem>
                                                            }
                                                            {problem.assigned && problem.status !== 'RESOLVED' && 
                                                            profile && profile.role.includes('USER') &&
                                                                <DropdownItem onClick={this.resolve.bind(this)} className="dropdown-item d-flex align-items-center" tag="a" href="#">
                                                                    حل المشكلة
                                                                </DropdownItem>
                                                            }
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                        
                            <div className="chat-content px-lg-8">
                                <div className="container-xxl py-6 py-lg-10">
                                    <div className="message">
                                        {problem.description}
                                    </div>
                                    {loadingAnswers ? (
                                        <div className="message row align-items-center">
                                            <Loading color="primary" status="wait" />
                                        </div>
                                    ) : (
                                        <>
                                        {answers.map((item, i) => {
                                            let date;

                                            let today = new Date();
                                            let yesterday = new Date();
                                            yesterday.setDate(yesterday.getDate() - 1);
                                        
                                            if(moment(item.createdAt).isSame(today, 'day')){
                                                date = "اليوم";
                                            }else if(moment(item.createdAt).isSame(yesterday, 'day')){
                                                date = "الامس";
                                            }else{
                                                date = moment(item.createdAt).locale('ar').format('MMM DD');
                                            }

                                            return(
                                                <div key={i} className={`message ${!item.profile.me && "message-right"}`}>
                                                    <div className={`avatar avatar-sm mr-lg-5 ${!item.profile.me ? "ml-4" : "mr-4"}`}>
                                                        <span className="avatar-img">{item.feeling}</span>
                                                    </div>
                                                    <div className="message-body">
                                                        <div className="message-row">
                                                            <div className={`message-content ${item.profile.me ? "bg-primary text-white" : "bg-light"}`}>
                                                                {!item.profile.me && 
                                                                    <h6 className="mb-2">{item.profile.name}</h6>
                                                                }
                                                                <div>{item.description}</div>
                                                                <div className="mb-1">
                                                                    <small className="opacity-65">{date}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        </>
                                    )}
                                </div>
                                <div className="end-of-chat"></div>
                            </div>

                            <div className="chat-footer border-top py-4 py-lg-6 px-lg-8">
                                <div className="container-xxl">

                                        <form id="comment">
                                            <div className="form-row align-items-center">
                                                <div className="col">
                                                    <div className="input-group">
                                                        <TextareaAutosize  
                                                            onChange={this.onChange.bind(this)}
                                                            name="description"
                                                            defaultValue={description}
                                                            className="form-control bg-transparent border-0" id="inputDes" rows="1" placeholder="اكتب تعليقاً..."
                                                            data-autosize="true"
                                                        ></TextareaAutosize >
                                                    </div>

                                                </div>
                                                
                                                <div className="col-auto">
                                                    <button 
                                                        onClick={this.createAnswer.bind(this)}
                                                        className="btn btn-ico btn-primary rounded-circle">
                                                            <span className="fe-send"></span>
                                                        </button>
                                                </div>
                                            </div>
                                            <div className="select-feeling">
                                                <Emoji 
                                                    group="status"
                                                    onChange={this.onChange.bind(this)} />
                                            </div>
                                        </form>
                                    

                                </div>
                            </div>

                        </div>

                    </div>
                )}
            </div>
        )
    }
}

export default Problem;