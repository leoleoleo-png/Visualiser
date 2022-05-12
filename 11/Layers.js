
let playing;



//FFT
let fft;
let spectrum;
let binAmplitude;
let bass, lowMid, mid, highMid, treble;
let waveform;

//AMPLITUDE
let amplitude;
let level;
let levelHistory = new Array(30);


//RANDOM COLOUR FILL
let colour1;

let slider;
// the shader variable
let camShader;

// the camera variable
let cam;



// we will need at least two layers for this effect
let shaderLayer;
let copyLayer;

function preload() {
  // load the shader
  camShader = loadShader('sketch.vert', 'sketch.frag');

  cam = createVideo(['skate.mp4', 'skate.ogv', 'skate.webm'], camLoad);
  cam.size(windowWidth, windowHeight);

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  let limitLabel = createP("Sensitivity");

  limitLabel.parent(controller);

  limitLabel.position(5, 40);

  slider = createSlider(1, 100, 50, 1);
  slider.parent(controller);


  // IF WE WANT WEBCAM INPUT
  //cam = createCapture(VIDEO);
  cam.size(width, height);


  // hide the html element that createCapture adds to the screen
  cam.hide();

  // this layer will use webgl with our shader
  shaderLayer = createGraphics(windowWidth/2, windowHeight/2, WEBGL);

  // this layer will just be a copy of what we just did with the shader
  copyLayer = createGraphics(windowWidth, windowHeight);


  //GATHERING MIC INPUT & DATA
  mic = new p5.AudioIn();
  mic.start();
  createAmplitude();
  userStartAudio()




  fileInput = createFileInput(handleFile);

  fileInput.size(180, 30);
  let col = color(224, 224, 224,0);
  fileInput.style('backgroundColor', col);
  fileInput.parent(controller);


  //LOWER FRAMERATE SMOOTHER BC VIDEO PROCESSING
  frameRate(30);


}

function draw() {
  getAmplitudeLevel();
  getMicVolume();


  let sliderVal = slider.value();
let mapped = map(micVolume, 0.0, 0.2, 0.0, 1.0);

let val = mapped*sliderVal;




  col1 = random(0, 1);

  // shader() sets the active shader with our shader
  shaderLayer.shader(camShader);

  // lets just send the cam to our shader as a uniform
  camShader.setUniform('tex0', cam);
let valMapped = (map(val,0.0,30,0.0,1.0));

  // also send the copy layer to the shader as a uniform

  camShader.setUniform('tex1', copyLayer);
  camShader.setUniform('colour1', colour1);
  camShader.setUniform('time', frameCount * 0.01);
  camShader.setUniform('mic', valMapped);

  // rect gives us some geometry on the screen
  shaderLayer.rect(0, 0, width, height);

  // draw the shaderlayer into the copy layer
  copyLayer.image(shaderLayer, 0, 0, width, height);

 
  //TOP LAYER COPY, PAINTERLY STRETCH
  
  if (val > 10) {
    image(shaderLayer, 0, 0, width * 100, height*2);
  }
 

  //TOP LAYER COPY, PAINTERLY STRETCH
  if (val > 5) {
  
      for (let x = 0; x < 10; x+=10) {
        image(shaderLayer, x, 0, width, height);
      }
    

      
    
    
  }


  if (val> 15) {
    
    for (let x = 0; x < windowWidth; x+=3) {
      image(shaderLayer, x, 0, width, height*1.3);
    }
    if (frameCount % 5 == 0) {
      image(shaderLayer, 0, 0, width*val, height);
      
      
      

    }
  }



  colour1 = val;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function camLoad() {
  cam.loop();
  cam.volume(0);
}


/* ========= */
/* AMPLITUDE */
/* ========= */

function createAmplitude() {
  // creates p5 amplitude constructor
  // remember to call this function in setup
  amplitude = new p5.Amplitude();
}

function getAmplitudeLevel() {
  // remember to delare global variable: let level;
  // stores amplitude values in variable level
  // values range from 0 to 1 but realistically from 0 to 0.6~
  level = amplitude.getLevel();
}



function createMic() {
  //create new p5 audioIn object
  //remember to put this function in set up
  mic = new p5.AudioIn();
  mic.start();
}

function getMicVolume() {
  //stores mic levels in variable micVolume
  //values range from 0 to 1
  micVolume = mic.getLevel();
}



function handleFile(file) {

  if (file.type === 'video') {

    cam = createVideo([file.data, '']);
    cam.size(windowWidth, windowHeight);

    cam.loop();
    cam.hide();
    cam.volume(0)
  } else {

  }
}
