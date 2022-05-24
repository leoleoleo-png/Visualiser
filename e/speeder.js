


let img;
let img2;
let img3;
let img4;
let img5;
let timer = 0;
let mic;
var shapes = 3;

function preload() {

  img4 = loadImage('../input/garbage.jpg')
  img2 = loadImage("flowers5.png");
  img3 = loadImage("img2.png");
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

  slider = createSlider(0.1, 0.2, 0.15, 0.01);
  slider.parent(controller);

  limitLabel.position(5, 40);





}




function draw() {


  let val = slider.value();

  getMicVolume();

  let mix = val * 5 * micVolume;

  let mox = map(mix, 0, 0.5, 1, 10);
  print(mox);
  noStroke();


  imageMode(CENTER);

  let waveform = fft.waveform();

  beginShape();

  var varImg = img2;



  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i] * 20, -1, 1, 0, height);


    if (shapes == 1) {
      varImg = img2;
    } else if (shapes == 2) {
      varImg = img3;
    } else if (shapes == 3) {
      varImg = img4;
    }

    image(varImg, y * 2, x, 1000 * mix, 1000 * mix);

    rotate(PI / micVolume / 10);

    if (mox > 2) {

      rotate(PI / micVolume * 2);

    }


    if (mox > 1.5) {

      rotate(PI / micVolume);

    }






  }

  endShape();








  if (millis() >= 1000 + timer) {

    if (mox > 1.5)
      shapesRandom();
    timer = millis();
  }

}



function shapesRandom() {

  if (shapes == 1) {

    shapes = 2;
  } else if (shapes == 2) {

    shapes = 3;
  } else if (shapes == 3) {

    shapes = 1;
  }

}

