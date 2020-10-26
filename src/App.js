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
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: []
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
  displayFaceBox = (boxes) => {
    console.log(boxes)
    this.setState({boxes: boxes})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
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

  //Otetaan käyttöön kaikki komponentit
  render() {
    return (
      <div className="App">
        <div>
          <p className='f3 white'>
                  {'Tämän sivun tarkoitus on tunnistaa kasvot kuvista.'}
              </p>
              <p className='i f4 white'>
                  {'Liitä kuvan linkki tekstikenttään.'}
          </p>
          <input className='f4 pa2 w-30 center' type='text' onChange={this.onInputChange} />
          <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
          <button className='w-30 grow f4 link ph3 pv2 dib white bg-mid-gray' onClick={this.onSubmit}>Tunnista</button>
        </div>
      </div>
    );
  }
}

export default App;
