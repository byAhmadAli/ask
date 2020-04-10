import React from 'react';

const Emoji = (props) => {
    return (
        <select {...props} className="form-control">
            <option value="" disabled selected>?</option>
            <option role="img">😭</option>
            <option role="img">😢</option>
            <option role="img">😐</option>
            <option role="img">😊</option>
            <option role="img">😃</option>
            <option role="img">😡</option>
        </select>
    );
}

export default Emoji;
