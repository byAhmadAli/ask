import React, {Component} from 'react';
import client from '../_utils/Client';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';
import MainMenu from '../components/main-menu';
import NoContent from '../components/no-content';
import PostCard from '../components/post-card';
import StatusCard from '../components/status-card';
import Emoji from '../components/emoji';
class Problems extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            problems: [],
            loading: true
        }
    }

    componentDidMount(){
        let problemUrl = this.props.profile && this.props.profile.role.includes('USER') ? '/problems/me' : 'problems';
        if(this.props.profile && this.props.profile.role.includes('ADMIN')){
            problemUrl = '/admin/problems'
        }
        
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
                        <div className="col-md-12">
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
                                                    <PostCard item={item} withLink={true} />
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