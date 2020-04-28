import React, {Component} from 'react';
import auth from '../../_services/Auth';
import { Link, Redirect } from "react-router-dom";
import logoImg from '../auth/logo.svg';
import StatusCard from '../../components/status-card';

class ProblemLayout extends Component{

    isAuthenticated () {
        return auth.isAuthenticated() ? <Redirect from="/login" to="/app" /> : null
    };

    render(){
        return(
            <div className="auth-layout">
                <div className="auth-content problem">
                    <h1 className="mb-3 font-weight-normal logo">
                        <Link to="/">
                            <img src={logoImg} alt="Fadfed logo" />
                        </Link>
                    </h1>
                    <StatusCard />
                    <p className="mb-0 text-muted">© 2020 فضفض</p>
                </div>
                {this.isAuthenticated()}
            </div>
            
        )
    }
}

export default ProblemLayout;