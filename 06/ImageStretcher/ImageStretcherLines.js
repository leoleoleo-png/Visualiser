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
  let limitLabel = createP("Sensitivity");

  limitLabel.parent(controller);

  limitLabel.position(10, 40);
  slider = createSlider(0, 60, 30);
  slider.parent(controller);



  noStroke();

  shaderTexture = createGraphics(10, 10, WEBGL);
  shaderTexture.noStroke();
  userStartAudio();

  let inputLabel = createP("Add your own image");
  inputLabel.parent(controller);
  inputLabel.position(10, 100);


  input = createFileInput(handleFile);
  input.parent(controller);
  input.size(180, 30);
  let col = color(255, 255, 255, 0);
  input.style('backgroundColor', col);

}

function draw() {

  let val = slider.value();

  getMicVolume();

  let micSlider = val * micVolume;

  shaderTexture.shader(camShader);

  // shader() sets the active shader with our shader
  shader(camShader);

  camShader.setUniform('u_resolution', [width / 100, height / 100]);

  // lets just send the cam to our shader as a uniform
  camShader.setUniform('tex0', cam);

  camShader.setUniform('tex1', img);

  camShader.setUniform('amt', map(micVolume, 0.0, 1, 0, 10));

  camShader.setUniform("resolution", [width, height]);

  shaderTexture.rect(0, 0, width, height);

  background(255);

  texture(shaderTexture);

  translate(-width / 2, -height / 2, 0);

  noStroke();

  copy(shaderTexture, 0, 0, 10, 10, 0, 0, windowWidth, windowHeight);


  let pixelMove = map(micSlider, 0, 50, 100, img.width)


  beginShape();
  noFill();

  let waveform = fft.waveform();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1 * micVolume * 10, 0, height);

    let e = (img.get(pixelMove, img.height / 2));

    stroke(e);
    strokeWeight(20);


    ellipse(x * 3, y, 3, 20 * micSlider);
    ellipse(x * 2, y, 1, 20 * micSlider);

    strokeWeight(1);

    let r = random(windowWidth);



    rotating();

    fill(255);
    strokeWeight(1 / 3);
    stroke(255, 255, 255, 3);


    if (frameCount % 5 == 0) {
      ellipse(micSlider, r / 2, 10, 10);

    }
    if (frameCount % 3 == 0) {
      ellipse(r * 1.5, r / 2, 5, 5);
    }

    if (frameCount % 15 == 0) {
      ellipse(r * 2 * micSlider, r / 2, 15, 15);
    }

    translate( 200, 200);
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