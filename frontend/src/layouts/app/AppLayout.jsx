import React, {Component} from 'react';
import client from '../../_utils/Client';
import MainMenu from '../../components/main-menu';
import { Switch, Redirect } from "react-router-dom";
import { ProtectedRoute } from "../../_utils/protected.route";
import auth from '../../_services/Auth';

import Problem from '../../pages/Problem';
import Problems from '../../pages/Problems';
import ProblemsActive from '../../pages/ProblemsActive';
import ProblemsResolved from '../../pages/ProblemsResolved';

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
            if(error.response.status === 401){
                auth.logout(() => window.location.pathname = '/auth/login');
            }
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
                            <ProtectedRoute exact path="/app/problems" component={Problems} profile={profile} />
                            <ProtectedRoute exact path="/app/problems/active" component={ProblemsActive} profile={profile} />
                            <ProtectedRoute exact path="/app/problems/resolved" component={ProblemsResolved} profile={profile} />
                            <ProtectedRoute exact path="/app/problems/show/:id" component={Problem} profile={profile} />
                            <Redirect exact from="/app" to="/app/problems" />
                            <Redirect exact from="/app/problems/show" to="/app/problems" />
                        </Switch>
                    </div>
                }
                
            </div>
            
        )
    }
}

export default AppLayout;