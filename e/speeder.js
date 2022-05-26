


let img;
let img2;
let img3;
let img4;
let img5;
let timer = 0;
let mic;
var shapes = 2;

function preload() {



  imgChoice = "img2.png"
  img = loadImage(imgChoice);



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


  let inputLabel = createP("Add your own image");
  inputLabel.parent(controller);
  inputLabel.position(10, 105);


  input = createFileInput(handleFile);
  input.parent(controller);
  input.size(180, 30);
  let col = color(255, 255, 255, 0);
  input.style('backgroundColor', col);


}




function draw() {


  let val = slider.value();

  getMicVolume();

  let mix = val  * micVolume;


  noStroke();


  imageMode(CENTER);

  let waveform = fft.waveform();

  beginShape();

  var varImg = img;



  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length / 2, 0, width * 2);
    let y = map(waveform[i * 2], -1, 1, 0, height);



    image(varImg, x, y * 2 - windowHeight / 2, 100 * mix, 100 * mix);



  }

  endShape();




  //copy(0, windowHeight / 2, windowWidth, 10, 0, 0, windowWidth, windowHeight);




}






function handleFile(file) {

  if (file.type === 'image') {

    img = loadImage(file.data, '');
  } else {

  }
}