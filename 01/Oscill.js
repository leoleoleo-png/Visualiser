

const u = 8;
let img;
let img2;
let img3;
let img4;

let mic;
var shapes = 1;

function preload() {
  img2 = loadImage("clown4.png");
  img3 = loadImage("clown3.png");
  img4 = loadImage("clown1.png");

}


function createMic() {
  mic = new p5.AudioIn();
  mic.start();

}

function getMicVolume() {
  micVolume = mic.getLevel();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  userStartAudio();

  let limitLabel = createP("Sensitivity");
  limitLabel.parent(controller);

  slider = createSlider(0, 4, 2);
  slider.parent(controller);

  limitLabel.position(10, 40);


 /*  button = createButton('Mode A');
  button.mousePressed(changeShapes);

  button.parent(controller); */

 /*  button2 = createButton('Mode B');
  button2.mousePressed(changeShapesB);

  button2.parent(controller); */





}




function draw() {

  let val = slider.value();
  background(0);
  getMicVolume();

  let spectrum = fft.analyze();

  noStroke();

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    fft.analyze();
  }




  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255);
  strokeWeight(1 / 2);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i] * val, -1, 1, 0, height);


    if (shapes == 1) {
      image(img4, x, y, 10, 10);



    } else if (shapes == 2) {


      image(img3, x * 2, y - windowHeight / 30, 2, 2);
      image(img3, x * 1.2, y - windowHeight / 30, 2, 2);

    } else if (shapes == 3) {

      strokeWeight(1);
      

      rect(x, y, 40);
      



    }

  }
  endShape();
}


function changeShapes() {

    shapes = 1;
 
}

function changeShapesB() {

    shapes = 2;
  
}