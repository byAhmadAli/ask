import React, {Component} from 'react';
import client from '../../_utils/Client';
import Loading from '../../components/loading';
import { Link } from 'react-router-dom';
import MainMenu from '../../components/main-menu';
import NoContent from '../../components/no-content';
class Assigned extends Component{
    constructor(props){
        super(props);
        this.state = {
            problems: [],
            loading: true,
            profile: null,
            profileLoaded: false
        }
    }

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/users/profile`)
        .then(res => {
            this.setState({
                profile: res.data,
                profileLoaded: true
            })
            if(res.data.role.includes('USER')) return window.location.pathname = '/app';
        })
        .catch((error) => {
            console.log(error);
        });

        client.get(`${process.env.REACT_APP_API_URL}/problems/assigned/me`)
        .then(res => {
            this.setState({
                problems: res.data,
                loading: false
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { problems, loading, profile, profileLoaded } = this.state;
        return(
            <div className="app-layout">
                <div className="main-nav">
                    <MainMenu profileLoaded={profileLoaded} profile={profile} active={3} />
                </div>
                <div className="content">
                    <div className="head">
                        <div className="container">
                            <div className="col-md-12">
                                <h3>مخصصه لي</h3>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div>
                            {loading ? (
                                <div className="row">
                                    <Loading color="primary" status="wait" />
                                </div>
                            ) : ( problems.active_problems.length > 0 ?
                                <div>
                                    { problems.active_problems.map((item, i) => {
                                        let statusColor;
                                        if(item.status === 'OPEN'){
                                            statusColor = "danger";
                                        }else if(item.status === 'ACTIVE'){
                                            statusColor = "primary";
                                        }else if(item.status === 'RESOLVED'){
                                            statusColor = "success";
                                        }else{
                                            statusColor = "secondary";
                                        }
                                        return(
                                            <div key={i} className="row">
                                                <div className="col-md-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <Link to={`/app/problems/${item._id}`}></Link>
                                                            <div className={`badge badge-${statusColor}`}>{item.status}</div>
                                                            <h5 className="card-title">{item.feeling} - {item.type}</h5>
                                                            <p className="card-text">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            : (
                                <NoContent />
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Assigned;