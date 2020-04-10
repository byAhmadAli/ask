import React from 'react';
import { NavLink } from 'react-router-dom';
import auth from '../_services/Auth';

const MainMenu = (props) => {
    
    const { profileLoaded, profile, active } = props;
    if(!profileLoaded) return ""
    return (
        <div className="main-nav">
            <div className="item">
                <NavLink exact activeClassName="active" to="/app/problems">
                    <svg className="bi bi-inboxes" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M.125 11.17A.5.5 0 01.5 11H6a.5.5 0 01.5.5 1.5 1.5 0 003 0 .5.5 0 01.5-.5h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0114.117 16H1.883a1.5 1.5 0 01-1.489-1.314l-.39-3.124a.5.5 0 01.121-.393zm.941.83l.32 2.562a.5.5 0 00.497.438h12.234a.5.5 0 00.496-.438l.32-2.562H10.45a2.5 2.5 0 01-4.9 0H1.066zM3.81.563A1.5 1.5 0 014.98 0h6.04a1.5 1.5 0 011.17.563l3.7 4.625a.5.5 0 01-.78.624l-3.7-4.624A.5.5 0 0011.02 1H4.98a.5.5 0 00-.39.188L.89 5.812a.5.5 0 11-.78-.624L3.81.563z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M.125 5.17A.5.5 0 01.5 5H6a.5.5 0 01.5.5 1.5 1.5 0 003 0A.5.5 0 0110 5h5.5a.5.5 0 01.496.562l-.39 3.124A1.5 1.5 0 0114.117 10H1.883A1.5 1.5 0 01.394 8.686l-.39-3.124a.5.5 0 01.121-.393zm.941.83l.32 2.562A.5.5 0 001.884 9h12.234a.5.5 0 00.496-.438L14.933 6H10.45a2.5 2.5 0 01-4.9 0H1.066z" clipRule="evenodd"/>
                    </svg>
                    <span>My Active Problems</span>
                </NavLink>
            </div>
            {profile && profile.role.includes('USER') && 
                <div className="item">
                    <NavLink exact activeClassName="active" to="/app/create">
                        <svg className="bi bi-chat-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z" clipRule="evenodd"/>
                            <path d="M5 8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                        </svg>
                        <span>Create Problem</span>
                    </NavLink>
                </div>
            }
            {profile && profile.role.includes('HELPER') && 
                <div className="item">
                    <NavLink exact activeClassName="active" to="/app/assigned">
                        <svg class="bi bi-bookmark" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 12l5 3V3a2 2 0 00-2-2H5a2 2 0 00-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V3a1 1 0 00-1-1H5a1 1 0 00-1 1v10.234z" clip-rule="evenodd"/>
                        </svg>
                        <span>Assigned Problem</span>
                    </NavLink>
                </div>
            }
            <div className="item">
                <a href="#" onClick={() => auth.logout(
                    ()=> {window.location.pathname = '/'}
                )}>
                    <svg className="bi bi-power" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.578 4.437a5 5 0 104.922.044l.5-.866a6 6 0 11-5.908-.053l.486.875z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M7.5 8V1h1v7h-1z" clipRule="evenodd"/>
                    </svg>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    );
    
}

export default MainMenu;
