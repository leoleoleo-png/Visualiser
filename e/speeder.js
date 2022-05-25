


let img;
let img2;
let img3;
let img4;
let img5;
let timer = 0;
let mic;
var shapes = 2;

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

  slider = createSlider(0.1, 10.1, 5.1, 0.01);
  slider.parent(controller);

  limitLabel.position(10, 40);





}




function draw() {


  let val = slider.value();

  getMicVolume();

  let mix = val * 5 * micVolume;

  let mox = map(micVolume, 0, 0.6, 1, 100);

  noStroke();


  imageMode(CENTER);

  let waveform = fft.waveform();

  beginShape();

  var varImg = img2;



  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length / 2, 0, width * 2);
    let y = map(waveform[i * 2], -1, 1, 0, height);



    if (shapes == 1) {
      varImg = img2;
    } else if (shapes == 2) {
      varImg = img3;
    } else if (shapes == 3) {
      varImg = img4;
    }

    image(varImg, x, y * 2 - windowHeight / 2, 100 * mix, 100 * mix);

    //image(varImg, x, y * 3 - windowHeight, 1000 * mix, 1000 * mix);




    //translate(200,2);


  }

  endShape();




  copy(0, windowHeight / 2, windowWidth, 10, 0, 0, windowWidth, windowHeight);



  if (millis() >= 300 + timer) {

    if (map(micVolume*val, 0,3,0,10) > 5) {

      shapesRandom();
      timer = millis();
    }
     
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

