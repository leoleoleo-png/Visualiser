let camShader;


let cam;

let input;


let img;


let mic;
let slider;

var imgChoice;



function preload() {

  camShader = loadShader('ImageStretcher/ImageStretcherLines.vert', 'ImageStretcher/ImageStretcherLines.frag');
  cam = loadImage('IMAGES/displace3.jpeg');

  imgChoice = 'IMAGES/flowers.jpg'
  img = loadImage(imgChoice);



}


function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  createAmplitude();

  frameRate(60);

  slider = createSlider(0, 40, 20);
  slider.parent(controller);



  noStroke();

  shaderTexture = createGraphics(10, 10, WEBGL);
  shaderTexture.noStroke();
  userStartAudio();


  input = createFileInput(handleFile);
  input.parent(controller);
  input.size(170,30);

}

function draw() {

  let val = slider.value();

  getMicVolume();

  let micSlider = val * micVolume * 10;

  shaderTexture.shader(camShader);

  // shader() sets the active shader with our shader
  shader(camShader);

  camShader.setUniform('u_resolution', [width / 10, height / 10]);

  // lets just send the cam to our shader as a uniform
  camShader.setUniform('tex0', cam);

  camShader.setUniform('tex1', img);

  camShader.setUniform('amt', map(micVolume, 0.0, 1, 0, 40));

  camShader.setUniform("resolution", [width, height]);

  shaderTexture.rect(0, 0, width, height);

  background(255);

  texture(shaderTexture);

  translate(-width / 2, -height / 2, 0);

  noStroke();

  copy(shaderTexture, 0, 0, micSlider * 10,micSlider * 10, 0, 0, windowWidth, windowHeight);

  let pixelMove = map(micSlider, 0, 10, 0, img.width)


  beginShape();
  noFill();

  let waveform = fft.waveform();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1 * micVolume * 10, 0, height);

    let e = (img.get(pixelMove, height / 2));

    stroke(e);
    strokeWeight(20);


    ellipse(x * 3, y, 3, 20 * micSlider);
    ellipse(x * 2, y, 1, 20 * micSlider);

    strokeWeight(1);

    let r = random(windowWidth);

    rotating();
    fill(255);
    ellipse(r, r / 2, 10, 10);
    translate(0.8 * width, height / 2);
  }
  endShape();

}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
function createAmplitude() {
  // creates p5 amplitude constructor
  // remember to call this function in setup
  amplitude = new p5.Amplitude();
}

function rotating() {
  rotate(micVolume * 10)
}


function handleFile(file) {

  if (file.type === 'image') {

    img = loadImage(file.data, '');
  } else {

  }
}