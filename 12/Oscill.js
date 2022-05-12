


let a = 0;
let b = 0;
let dim = 80.0;


let img4;

let mic;
var shapes = 1;

var varcool = 255;

let button;

function preload() {

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



  button = createButton('Shapes');
  button.mousePressed(changeShapes);
  button.size(180, 30);
  button.parent(controller);


}




function draw() {


 
  getMicVolume();
  a = a + 5*micVolume*10;
  // If the shape goes off the canvas, reset the position
  if (a > width + dim) {
    a = -dim;
  }

  

  let spectrum = fft.analyze();

  background('#030213');



  if (shapes == 1) {
    varcool = 255;


  }
  else if (shapes == 2) {
    varcool = 100;

  }

  translate(a, 0);

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, varcool, height, 0);



    if (shapes == 1) {

      image(img4, x * 1.2, h + windowHeight, 7, 7);

      image(img4, x * 1.2, h + windowHeight - 210, 7, 7);


      image(img4, x * 1.2-windowWidth, h + windowHeight - 10, 7, 7);

      image(img4, x * 1.2-windowWidth, h + windowHeight - 210, 7, 7);

    }
    else if (shapes == 2) {

      image(img4, x * 1.2, h + windowHeight, 1, 10);

      image(img4, x * 2 - 300, h + windowHeight, 2, 10);

      image(img4, x * 1.2, height - (h + windowHeight), 2, 2);

      image(img4, x * 2.3 + 600, h + windowHeight, 3, 15);




      image(img4, x * 1.2-windowWidth, h + windowHeight, 2, 10);

      image(img4, x * 2 - 300-windowWidth, h + windowHeight, 2, 10);

      image(img4, x * 1.2-windowWidth, height - (h + windowHeight), 2, 2);

      image(img4, x * 2.3 + 600-windowWidth, h + windowHeight, 3, 15);

    } 

  

    fft.analyze();
  }


}


function changeShapes() {

  if (shapes == 1) {
    shapes = 2;
  } else if (shapes == 2) {
    shapes = 1;
  } 
    
}
