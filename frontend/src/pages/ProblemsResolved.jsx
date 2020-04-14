import React, {Component} from 'react';
import client from '../_utils/Client';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';
import NoContent from '../components/no-content';
import PostCard from '../components/post-card';

class ProblemsResolved extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            problems: [],
            loading: true
        }
    }

    componentDidMount(){
        const { profile } = this.props;
        let baseUrl = profile && profile.role.includes('HELPER') ? 'problems/assigned' : 'problems'
        client.get(`${process.env.REACT_APP_API_URL}/${baseUrl}?status=RESOLVED`)
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

        return(
            <div>
                <div className="head">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3>مشاكل محلولة</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="post-layout">
                        <div className="row">
                            <div className="col-md-12">
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
                                    <NoContent />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProblemsResolved;