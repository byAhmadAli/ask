import React from 'react';
import { NavLink } from 'react-router-dom';
import auth from '../_services/Auth';

import {
    UncontrolledTooltip
} from 'reactstrap';

const MainMenu = (props) => {
    
    const { profileLoaded, profile } = props;
    if(!profileLoaded) return ""
    return (
        <div className="main-nav">
            <div className="item">
                <NavLink id="item-01" exact activeClassName="active" to="/app/problems">
                <svg className="bi bi-files" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 2h8a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H3z" clipRule="evenodd"/>
                    <path d="M5 0h8a2 2 0 012 2v10a2 2 0 01-2 2v-1a1 1 0 001-1V2a1 1 0 00-1-1H5a1 1 0 00-1 1H3a2 2 0 012-2z"/>
                </svg>
                </NavLink>
                <UncontrolledTooltip
                    delay={0}
                    target="item-01"
                    placement="right"
                    className="d-none d-lg-block"
                >
                    مشاكل جديدة
                </UncontrolledTooltip>
                <UncontrolledTooltip
                    delay={0}
                    target="item-01"
                    placement="top"
                    className="d-lg-none"
                >
                    مشاكل جديدة
                </UncontrolledTooltip>
            </div>
            {profile && profile.role.includes('USER') && 
                <>
                    <div className="item">
                        <NavLink id="item-02" exact activeClassName="active" to="/app/problems/active">
                            <svg className="bi bi-file-earmark" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 1h5v1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6h1v7a2 2 0 01-2 2H4a2 2 0 01-2-2V3a2 2 0 012-2z"/>
                                <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 019 4.5z"/>
                            </svg>
                        </NavLink>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-02"
                            placement="right"
                            className="d-none d-lg-block"
                        >
                            مشاكل قيد المعالجة
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-02"
                            placement="top"
                            className="d-lg-none"
                        >
                            مشاكل قيد المعالجة
                        </UncontrolledTooltip>
                    </div>
                    <div className="item">
                        <NavLink id="item-03" exact activeClassName="active" to="/app/problems/resolved">
                            <svg className="bi bi-file-earmark-check" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 1H4a2 2 0 00-2 2v10a2 2 0 002 2h5v-1H4a1 1 0 01-1-1V3a1 1 0 011-1h5v2.5A1.5 1.5 0 0010.5 6H13v2h1V6L9 1z"/>
                                <path fillRule="evenodd" d="M15.854 10.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708l1.146 1.147 2.646-2.647a.5.5 0 01.708 0z" clipRule="evenodd"/>
                            </svg>
                        </NavLink>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-03"
                            placement="right"
                            className="d-none d-lg-block"
                        >
                            مشاكل محلولة
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-03"
                            placement="top"
                            className="d-lg-none"
                        >
                            مشاكل محلولة
                        </UncontrolledTooltip>
                    </div>
                </>
            }
            {profile && profile.role.includes('HELPER') && 
                <>
                    <div className="item">
                        <NavLink id="item-04" exact activeClassName="active" to="/app/problems/active">
                            <svg className="bi bi-bookmark" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 12l5 3V3a2 2 0 00-2-2H5a2 2 0 00-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V3a1 1 0 00-1-1H5a1 1 0 00-1 1v10.234z" clip-rule="evenodd"/>
                            </svg>
                        </NavLink>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-04"
                            placement="right"
                            className="d-none d-lg-block"
                        >
                            مشاكل مخصصه
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-04"
                            placement="top"
                            className="d-lg-none"
                        >
                            مشاكل مخصصه
                        </UncontrolledTooltip>
                    </div>

                    <div className="item">
                        <NavLink id="item-05" exact activeClassName="active" to="/app/problems/resolved">
                            <svg className="bi bi-bookmark-check" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.5 2a.5.5 0 00-.5.5v11.066l4-2.667 4 2.667V8.5a.5.5 0 011 0v6.934l-5-3.333-5 3.333V2.5A1.5 1.5 0 014.5 1h4a.5.5 0 010 1h-4z" clip-rule="evenodd"/>
                                <path fill-rule="evenodd" d="M15.854 2.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708L12.5 4.793l2.646-2.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                            </svg>
                        </NavLink>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-05"
                            placement="right"
                            className="d-none d-lg-block"
                        >
                            مشاكل محلولة
                        </UncontrolledTooltip>
                        <UncontrolledTooltip
                            delay={0}
                            target="item-05"
                            placement="top"
                            className="d-lg-none"
                        >
                            مشاكل محلولة
                        </UncontrolledTooltip>
                    </div>
                </>
            }
            <div className="item">
                <a id="user-logout" href="#" onClick={() => auth.logout(
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
