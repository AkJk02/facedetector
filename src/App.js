import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import ImageRecognition from './components/ImageRecognition/ImageRecognition.js';
import './App.css';

//Otetaan käyttöön Clarifain API
const app = new Clarifai.App({
  apiKey: '49281616b54242249b7eec4f5d41de07'
});

//Taustan partikkelien asetukset
const particlesOptions = {
  particles: {
    number: {
      value: 110,
      density: {
        enable: true,
        value_area: 631
      }
    },
    move: {
      enable: true,
      speed: 10
    }
  },
  interactivity: {
    onhover: {
      enable: true,
      mode: "repulse"
    }
  }
}

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
        <Particles className='particles' 
          params={particlesOptions}
        />
        <ImageRecognition onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
