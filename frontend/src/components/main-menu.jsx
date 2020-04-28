import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoImg from '../layouts/app/logo.svg';
import auth from '../_services/Auth';

const MainMenu = () => {
    
    return (
        <div className="navigation navbar navbar-light justify-content-center py-xl-7">

            <Link className="d-none d-xl-block mb-6" to="/">
                <img src={logoImg} className="mx-auto fill-primary" data-inject-svg="" alt="" style={{height: "46px"}} />
            </Link>

            <ul className="nav navbar-nav flex-row flex-xl-column flex-grow-1 justify-content-between justify-content-xl-center py-3 py-lg-0" role="tablist">
                
                <li className="nav-item mt-xl-9">
                    <NavLink className="nav-link position-relative p-0 py-xl-3" id="item-01" exact activeClassName="active" to="/app/create">
                        <i className="icon-lg fe-edit"></i>
                    </NavLink>
                </li>

                <li className="nav-item mt-xl-9">
                    <NavLink className="nav-link position-relative p-0 py-xl-3" id="item-02" exact activeClassName="active" to="/app/profile">
                        <i className="icon-lg fe-user"></i>
                    </NavLink>
                </li>

                <li className="nav-item mt-xl-9">
                    <NavLink className="nav-link position-relative p-0 py-xl-3" id="item-03" activeClassName="active" to="/app/problems">
                        <i className="icon-lg fe-message-square"></i>
                        <div className="badge badge-dot badge-primary badge-bottom-center"></div>
                    </NavLink>
                </li>

                <li className="nav-item mt-xl-9 d-xl-block flex-xl-grow-1">
                    <NavLink className="nav-link position-relative p-0 py-xl-3" id="item-03" exact activeClassName="active" to="/app/settings">
                        <i className="icon-lg fe-settings"></i>
                    </NavLink>
                </li>
                <li className="nav-item mt-xl-9">
                    <Link className="nav-link position-relative p-0 py-xl-3" to="#" onClick={() => auth.logout(
                        ()=> {window.location.pathname = '/'}
                    )}>
                        <i className="icon-lg fe-power"></i>
                    </Link>
                </li>
            </ul>
        </div>
    );
    
}

export default MainMenu;
