import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
//import Navigation from './components/Navigation/Navigation.js'; 
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
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      enable: true,
      speed: 10
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: []
    }
  }

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

  displayFaceBox = (boxes) => {
    console.log(boxes)
    this.setState({boxes: boxes})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFace(response)))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' 
          params={particlesOptions}
        />
        {/*<Navigation />*/}
        <ImageRecognition onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
