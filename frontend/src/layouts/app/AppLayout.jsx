import React, {Component} from 'react';
import client from '../../_utils/Client';
import MainMenu from '../../components/main-menu';
import { createBrowserHistory } from "history";
import { Switch, Redirect } from "react-router-dom";
import { ProtectedRoute } from "../../_utils/protected.route";
import Create from '../../pages/Create';
import Problem from '../../pages/Problem';
import Problems from '../../pages/Problems';
import Assigned from '../../pages/assigned';


const hist = createBrowserHistory();

class AppLayout extends Component{
    constructor(props){
        super(props);
        this.state = {
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
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){
        const { profile, profileLoaded } = this.state;
        return(
            <div className="app-layout">
                <div className="main-nav">
                    <MainMenu profileLoaded={profileLoaded} profile={profile} active={1} />
                </div>
                {profileLoaded && 
                    <div className="content">
                        <Switch>
                            <ProtectedRoute exact path="/app/create" component={Create} profile={profile} />
                            <ProtectedRoute exact path="/app/problems" component={Problems} profile={profile} />
                            <ProtectedRoute exact path="/app/problems/:id" component={Problem} profile={profile} />
                            <ProtectedRoute exact path="/app/assigned" component={Assigned} profile={profile} />
                            <Redirect exact from="/app" to="/app/problems" />
                        </Switch>
                    </div>
                }
                
            </div>
            
        )
    }
}

export default AppLayout;