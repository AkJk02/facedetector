import React, { Component } from 'react';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import './App.css';

//Otetaan käyttöön Clarifain API
const app = new Clarifai.App({
  apiKey: '49281616b54242249b7eec4f5d41de07'
});

class App extends Component {
  //Konstruktori
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      face_boxes: [],
      message: false
    }
  }

  //Lasketaan kasvojen ympärille tulostettavan laatikon reunojen paikat
  calculateFace = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFaces.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    });
  }

  //Tulostetaan laatikot
  displayFaceBox = (face_boxes) => {
    console.log(face_boxes)
    this.setState({face_boxes: face_boxes})
  }

  //Hoitaa napin klikkaamisen
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //Tulostaa käyttöohjeen
  onButtonClickShow = () => {
    this.setState({message: true});
  }

  //Piilottaa käyttöohjeen
  onButtonClickHide = () => {
    this.setState({message: false});
  }

  //Kun painetaan lähetä nappia otetaan käyttöön API
  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFace(response)))
    .catch(err => console.log(err));
  }

  //Sisältää sivun rakenteen ja otetaan käyttöön kaikki komponentit
  render() {
    return (
      <div className="App">
        <div>
          <h1 className='white'>FaceDetector</h1>
          {this.state.message && <p className='white f5'>Liitä kuvan linkki tekstikenttään. Linkissä täytyy olla .jpg-pääte.</p>}
          <div className='pv2'>
            <button className='ph3 white bg-mid-gray' onClick={this.onButtonClickShow}>Käyttöohje</button>
            <button className='ph3 white bg-mid-gray' onClick={this.onButtonClickHide}>Piilota Käyttöohje</button>
          </div>
          <input className='f4 pa2 w-30 center' type='text' placeholder='Linkki tähän' onChange={this.onInputChange} />
          <FaceRecognition face_boxes={this.state.face_boxes} imageUrl={this.state.imageUrl} />
          <button className='w-30 grow f4 link ph3 pv2 dib white bg-mid-gray' onClick={this.onSubmit}>Tunnista</button>
        </div>
      </div>
    );
  }
}

export default App;
