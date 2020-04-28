import React from 'react';

const Emoji = (props) => {
    const { group, onChange } = props;
    return (
        <div className="ask-radio-button-wrapper">	
            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😶"
                    id={`${group}-problem-type-none`}
                    defaultChecked={true}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-none`}><span role="img" aria-label="none">😶</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😭"
                    id={`${group}-problem-type-awful`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-awful`}><span role="img" aria-label="awful">😭</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😢"
                    id={`${group}-problem-type-bad`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-bad`}><span role="img" aria-label="bad">😢</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😐"
                    id={`${group}-problem-type-okay`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-okay`}><span role="img" aria-label="okay">😐</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`} 
                    value="😊"
                    id={`${group}-problem-type-good`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-good`}><span role="img" aria-label="good">😊</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😃"
                    id={`${group}-problem-type-great`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-great`}><span role="img" aria-label="great">😃</span></label>
            </span>

            <span>
                <input 
                    type="radio" 
                    className="ask-radio-button" 
                    name={`feeling`}
                    value="😠"
                    id={`${group}-problem-type-angery`}
                    onChange={onChange}
                />
                <label htmlFor={`${group}-problem-type-angery`}><span role="img" aria-label="angery">😠</span></label>
            </span>
        </div>
    );
}

export default Emoji;
