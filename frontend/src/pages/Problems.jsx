import React, {Component} from 'react';
import client from '../_utils/Client';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';
import NoContent from '../components/no-content';
import PostCard from '../components/post-card';
import StatusCard from '../components/status-card';
import Qoutes from '../components/qoutes';

class Problems extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            problems: [],
            loading: true
        }
    }

    componentDidMount(){
        const { profile } = this.props;
        const baseUrl = (profile && profile.role.includes('ADMIN')) ? 'admin/problems' : 'problems?status=OPEN'
        client.get(`${process.env.REACT_APP_API_URL}/${baseUrl}`)
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
        const { problems, loading } = this.state;
        const { profile, history } = this.props;

        return(
            <div>
                <div className="head">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>مشاكل</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {profile && profile.role.includes('USER') && 
                                <StatusCard history={history} />
                            }
                            
                            {loading ? (
                                <div className="row">
                                    <Loading color="primary" status="wait" />
                                </div>
                            ) : (problems.length > 0 ? 
                                <div>
                                    {problems.map((item, i) => {
                                        return(
                                            <div key={i} className="row">
                                                <div className="col-md-12">
                                                    <PostCard item={item} withLink={true} profile={profile} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            :(
                                <NoContent />
                            ))}
                        </div>
                        
                        <div className="col-lg-4">
                            <Qoutes />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Problems;