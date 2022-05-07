let camShader;


let cam;

let input;
let userImg;

var pupImg;


let mic;
let slider;





function preload() {

  camShader = loadShader('ImageStretcher/ImageStretcherLines.vert', 'ImageStretcher/ImageStretcherLines.frag');
  cam = loadImage('IMAGES/displace3.jpeg');
  pupImg = loadImage('IMAGES/flowers.jpg');



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
  input.position(0, 0);
}

function draw() {

  if (userImg) {

    var imageValue = userImg;

    let val = slider.value();

    getMicVolume();

    let micSlider = val * micVolume * 10;

    shaderTexture.shader(camShader);

    // shader() sets the active shader with our shader
    shader(camShader);

    camShader.setUniform('u_resolution', [width / 10, height / 10]);

    // lets just send the cam to our shader as a uniform
    camShader.setUniform('tex0', cam);

    camShader.setUniform('tex1', imageValue);

    camShader.setUniform('amt', map(micVolume, 0.0, 1, 0, 40));

    camShader.setUniform("resolution", [width, height]);

    shaderTexture.rect(0, 0, width, height);

    background(255);

    texture(shaderTexture);

    translate(-width / 2, -height / 2, 0);

    noStroke();

    copy(shaderTexture, 0, 0, 1 * micSlider * 10, 1 * micSlider * 10, 0, 0, windowWidth, windowHeight);

    let pixelMove = map(micSlider, 0, 10, 0, windowWidth)


    beginShape();
    noFill();

    let waveform = fft.waveform();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1 * micVolume * 10, 0, height);

      let e = (imageValue.get(pixelMove, height / 2));

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
  } else {

    var imageValue = pupImg;



    let val = slider.value();

    getMicVolume();

    let micSlider = val * micVolume * 10;

    shaderTexture.shader(camShader);

    // shader() sets the active shader with our shader
    shader(camShader);

    camShader.setUniform('u_resolution', [width / 10, height / 10]);

    // lets just send the cam to our shader as a uniform
    camShader.setUniform('tex0', cam);

    camShader.setUniform('tex1', imageValue);

    camShader.setUniform('amt', map(micVolume, 0.0, 1, 0, 40));

    camShader.setUniform("resolution", [width, height]);

    shaderTexture.rect(0, 0, width, height);

    background(255);

    texture(shaderTexture);

    translate(-width / 2, -height / 2, 0);

    noStroke();

    copy(shaderTexture, 0, 0, 1 * micSlider * 10, 1 * micSlider * 10, 0, 0, windowWidth, windowHeight);

    let pixelMove = map(micSlider, 0, 10, 0, windowWidth)


    beginShape();
    noFill();

    let waveform = fft.waveform();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1 * micVolume * 10, 0, height);

      let e = (imageValue.get(pixelMove, height / 2));

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
    userImg = createImg(file.data, '');
    userImg.hide();
  } else {
    userImg = null;
  }
}