

const u = 8;
let img;
let img2;
let img3;
let img4;

let mic;
var shapes = 3;
let button;
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

  slider = createSlider(0, 4, 2);
  slider.parent(controller);


  button = createButton('Shapes');
  button.mousePressed(changeShapes);
  button.size(170, 30);
  button.parent(controller);


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

    } else if (shapes == 3) {

      strokeWeight(1 / 4);
      image(img2, x, y, 15, 15);

      image(img4, x * 2, y - 50, 10, 10);

      image(img3, x * 2, y + 100, 5, 20);

      image(img3, windowWidth, 200, x, y);

      rect(x, y, 40);



    }

  }
  endShape();
}


function changeShapes() {

  if (shapes == 1) {
    shapes = 2;
  } else if (shapes == 2) {
    shapes = 3;
  } else if (shapes == 3) {
    shapes = 1;
  }
}