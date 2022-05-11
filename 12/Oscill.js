

const u = 8;
let img;
let img2;
let img3;
let img4;
let a = 0;
let b = 0;
let mic;
var shapes = 1;
let button;
function preload() {
  img2 = loadImage("lovers.png");
  img3 = loadImage("arrow.png");
  img4 = loadImage("arrow.png");

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

  getMicVolume();

  let spectrum = fft.analyze();

  noStroke();


  background(0);

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 300, height, 0);
    
    image(img4, x*1.2, h+windowHeight-20, 7, 7);

    image(img4, x*1.2, h+windowHeight-200,  7, 7);


    
    //image(img4, windowWidth/2, windowHeight/2,  h, x);

   /*  image(img2, windowWidth/2, windowHeight/1.5,  x, h);

    image(img2, 0, windowHeight/1.5,  x, h); */


    fft.analyze();
  }




  let waveform = fft.waveform();

  beginShape();
 
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i] * val, -1, 1, 0, height);


    //image(img2, y + windowWidth / 7, x, a, 10);

   
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
