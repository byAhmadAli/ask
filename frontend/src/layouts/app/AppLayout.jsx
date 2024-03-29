import React, {Component} from 'react';
import MainMenu from '../../components/main-menu';

import client from '../../_utils/Client';
import { Switch, Redirect } from "react-router-dom";
import { ProtectedRoute } from "../../_utils/protected.route";

import Problems from '../../pages/Problems';
import Problem from '../../pages/Problem';

import auth from '../../_services/Auth';
import realTime from '../../_services/real-time';
import Settings from '../../pages/Settings';
import StatusCard from '../../components/status-card';
import NoContent from '../../components/no-content';


class AppLayout extends Component{
    constructor(props){
        super(props);
        this.state = {
            profile: null,
            profileLoaded: false,
            settings: null,
            settingsLoaded: false
        }
    }

    componentDidMount(){
        client.get(`${process.env.REACT_APP_API_URL}/users/profile`)
        .then(res => {
            this.setState({
                profile: res.data,
                profileLoaded: true
            }, ()=>{ 
                if(res.data.roleId){
                    realTime.socket.emit('join', res.data.roleId);
                }
                realTime.socket.emit('join', res.data.id);

                client.get(`${process.env.REACT_APP_API_URL}/users/settings`, this.state)
                .then(res => {
                    this.setState({
                        settings: res.data,
                        settingsLoaded: true
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            });
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
            <div className="layout">
                <MainMenu />
                <div className="sidebar">
                    <div className="d-flex flex-column h-100">

                        <div className="hide-scrollbar">
                            <div className="container-fluid py-6">
                                {profileLoaded &&
                                    <Switch>
                                        {profile.role.includes('USER') && 
                                            <ProtectedRoute exact path="/app/create" component={StatusCard} profile={profile} />
                                        }
                                        <ProtectedRoute path="/app/problems" component={Problems} profile={profile} />
                                        <ProtectedRoute exact path="/app/profile" component={NoContent} profile={profile} />
                                        <ProtectedRoute exact path="/app/settings" component={Settings} profile={profile} />
                                        <Redirect exact from="/app" to="/app/problems" />
                                    </Switch>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                
                {profileLoaded && 
                    <Switch>
                        <ProtectedRoute exact path="/app/problems/:id" component={Problem} profile={profile} />
                    </Switch>
                }
                
            </div>
        )
    }
}

export default AppLayout;