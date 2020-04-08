import React from 'react';

const Loading = (props) => {
    const {color, status} = props;
    return (
        <div className={`spinner-border text-${color} m-auto`} role={status}>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export default Loading;
