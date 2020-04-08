import React, {Component} from 'react';
import client from '../../_utils/Client';
import Loading from '../../components/loading';
import { Link } from 'react-router-dom';
import MainMenu from '../../components/main-menu';
import NoContent from '../../components/no-content';
class Problems extends Component{
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
            }, () => {
                let problemUrl = this.state.profile.role.includes('USER') ? '/problems/me' : 'problems';
                client.get(`${process.env.REACT_APP_API_URL}/${problemUrl}`)
                .then(res => {
                    this.setState({
                        problems: res.data,
                        loading: false
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
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
                    <MainMenu profileLoaded={profileLoaded} profile={profile} active={1} />
                </div>
                <div className="content">
                    <div className="head">
                        <div className="container">
                            <div className="col-md-12">
                                <h3>مشاكل</h3>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div>
                            {loading ? (
                                <div className="row">
                                    <Loading color="primary" status="wait" />
                                </div>
                            ) : (problems.length > 0 ? 
                                <div>
                                    {problems.map((item, i) => {
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
                            :(
                                <NoContent component={
                                    <Link className="btn btn-md btn-primary mb-3" to="/app/create">انشاء جديد</Link>}/>
                            ))}
                        </div>
                        
                    </div>
                </div>
            </div>
            
        )
    }
}

export default Problems;