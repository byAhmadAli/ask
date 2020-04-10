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
                <label htmlFor={`${group}-problem-type-none`}>😶</label>
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
                <label htmlFor={`${group}-problem-type-awful`}>😭</label>
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
                <label htmlFor={`${group}-problem-type-bad`}>😢</label>
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
                <label htmlFor={`${group}-problem-type-okay`}>😐</label>
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
                <label htmlFor={`${group}-problem-type-good`}>😊</label>
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
                <label htmlFor={`${group}-problem-type-great`}>😃</label>
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
                <label htmlFor={`${group}-problem-type-angery`}>😠</label>
            </span>
        </div>
    );
}

export default Emoji;
