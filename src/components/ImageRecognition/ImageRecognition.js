import React from 'react';
/*import './ImageRecognition.css';*/

const ImageRecognition = ({ onInputChange, onSubmit }) => {
    return (
        <div>
            <p className='f3 white'>
                {'Tämän sivun tarkoitus on tunnistaa kasvot kuvista.'}
            </p>
            <p className='i f4 white'>
                {'Liitä kuvan linkki tekstikenttään.'}
            </p>
            <div className='center'>
                <div className='form center pa2 br3 shadow-5 w-30'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} />
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-mid-gray' onClick={onSubmit}>Tunnista</button>
                </div>
            </div>
        </div>
    );
}

export default ImageRecognition;