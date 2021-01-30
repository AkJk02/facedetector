import React from 'react';
import './FaceRecognition.css';

//Komponentti tulostaa kuvan ja tulostaa kasvojen ympärille tulevat laatikot
const FaceRecognition = ({ imageUrl, face_boxes }) => {
    return (
        <div className='center'>
            <div className='relative mt2 mb2'>            
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
                {
                    face_boxes.map((box, i) => {
                        const { topRow, rightCol, bottomRow, leftCol } = box;
                        return (<div key={i} id='face' className='bounding-box' style={{top: topRow, right: rightCol, bottom: bottomRow, left: leftCol}}></div>);
                    })
                }
            </div>
        </div>
    );
}

export default FaceRecognition;