import React from 'react';
import { NavLink } from 'react-router-dom';

import avatarImg from '../layouts/app/avatar.png';

const moment = require('moment');
require("moment/locale/ar")


const PostCard = (props) => {
    const { item } = props;
    
    let date;

    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if(moment(item.createdAt).isSame(today, 'day')){
        date = "اليوم";
    }else if(moment(item.createdAt).isSame(yesterday, 'day')){
        date = "الامس";
    }else{
        date = moment(item.createdAt).locale('ar').format('MMM DD');
    }

    return (
        <NavLink className="text-reset nav-link p-0 mb-6" exact activeClassName="active" to={`/app/problems/${item._id}`}>
            <div className="card card-active-listener">
                <div className="card-body">

                    <div className="media">
                        <div className="avatar ml-5">
                            <img className="avatar-img" src={avatarImg} alt="Scorpion" />
                        </div>

                        <div className="media-body overflow-hidden">
                            <div className="d-flex align-items-center mb-1">
                                <h6 className="text-truncate mb-0 ml-auto">{item.type}</h6>
                                <p className="small text-muted text-nowrap mr-4">{date}</p>
                            </div>
                            <div className="text-truncate">{item.lastAnswer? item.lastAnswer.description : item.description}</div>
                        </div>
                    </div>
                </div>    
                {item.unReadCount > 0 &&
                    <div className="badge badge-circle badge-primary badge-border-light badge-top-left">
                        <span>{item.unReadCount}</span>
                    </div>
                }
            </div>
        </NavLink>
    );
}

export default PostCard;