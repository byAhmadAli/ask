import React, {Component} from 'react';
import client from '../_utils/Client';
import Loading from '../components/loading';
import StatusCard from '../components/status-card';
import PostCard from '../components/post-card';
import realTime from '../_services/real-time';

class Problems extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            problems: [],
            loading: true
        }
    }

    componentDidMount(){
        realTime.socket.on(
            "show_notification", 
            res => {
                let problems = [...this.state.problems];
                if(res.data.update){
                    const index = problems.findIndex(item => item._id === res.data._id);
                    if(index > -1){
                        const updated = Object.assign(problems[index], res.data);
                        problems[index] = updated;
                    }
                }else{
                    problems.unshift(res.data);
                }

                this.setState({
                    problems: problems.sort((a,b) =>new Date(b.updatedAt) - new Date(a.updatedAt))
                })
            }
        );

        client.get(`${process.env.REACT_APP_API_URL}/problems`)
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
        const { profile } = this.props;

        return(
            <>
                <h2 className="font-bold mb-6">فضفضات</h2>
                
                {loading ? (
                    <div className="row">
                        <Loading color="primary" status="wait" />
                    </div>
                ) : (problems.length > 0 ? 
                    <>  
                        {problems.map((item, i) => {
                            return(
                                <PostCard key={i} item={item} withLink={true} profile={profile} />
                            )
                        })}
                    </>
                :(
                    <StatusCard />
                ))}
            </>
        )
    }
}

export default Problems;