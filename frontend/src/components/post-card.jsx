import React from 'react';
import { Link } from 'react-router-dom';

function getStatusColor(status){
    let statusColor;
    if(status === 'OPEN'){
        statusColor = "secondary";
    }else if(status === 'ACTIVE'){
        statusColor = "primary";
    }else if(status === 'RESOLVED'){
        statusColor = "success";
    }else if(status === 'DELETED'){
        statusColor = "danger";
    }else{
        statusColor = "secondary";
    }

    return statusColor;
}

const PostCard = (props) => {
    const { item, withLink } = props;
    
    return (
        <div className="card">
            <div className="card-body">
                {withLink && 
                    <Link className="cover-card" to={`/app/problems/show/${item._id}`} />
                }
                <div className="post-head clearfix">
                    <div className="feeling">
                        {item.feeling}
                    </div>
                    <div className="description">
                        <div className={`badge badge-${getStatusColor(item.status)}`}>{item.status}</div>
                        <h5 className="card-title">{item.type}</h5>
                    </div>
                </div>
                <hr />
                <p className="card-text">{item.description}</p>
            </div>
        </div>
    );
}

export default PostCard;