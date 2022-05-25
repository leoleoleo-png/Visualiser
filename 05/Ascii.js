let mic;
let slider;
let slider2;
let timer = 0;
let timer2 = 0;
let fileInput;
var multip = 1;
let amplitude;
let micVolume;
let micVolumeHistory = new Array(30);
var userChoice;
var framed = 1;


var shapes = 1;
let img;
let img2;
let img3;
let img4;

let fillThresh;

let mic3;
let sound;

let fontSize;
var myAsciiArt;

var asciiart_width = 100;
var asciiart_height = 20;

var myCapture;


var gfx;

var ascii_arr;
var imgChoice;
//FONT OPTIONS
var fontName;
var fontName2;

//TEXT COLOUR OPTIONS A & B
var textColour;
var imageChoice;

var e;


function preload() {

  fontName = "Crosses.otf";
  fontName2 = "Crosses";

  myFont = loadFont(fontName);

  imgChoice = "band2.jpg"
  img = loadImage(imgChoice);


}

function setup() {

  mic = new p5.AudioIn();
  mic.start();

  let limitLabel = createP("Sensitivity");
  limitLabel.parent(controller);
  limitLabel.position(10, 40);
  slider = createSlider(0, 10, 5);




  button2 = createButton('Change font');
  button2.mousePressed(changeFont);
  button2.size(180, 30);



  slider.parent(controller);


  button2.parent(controller);


  imageMode(CENTER);

  createCanvas(windowWidth, windowHeight);
  myCapture = createVideo(["../input/skate.mp4"]);
  myCapture.size(windowWidth, windowHeight);

  myCapture.loop();
  myCapture.volume(0);
  myCapture.hide();


  let inputLabel = createP("Add your own video");
  inputLabel.parent(controller);
  inputLabel.position(10, 133);

  fileInput = createFileInput(handleFile);
  fileInput.size(180, 30);
  let col = color(224, 224, 224, 0);
  fileInput.style('backgroundColor', col);

  fileInput.parent(controller);
  button4 = createButton('Switch to camera');
  button4.size(180, 30);
  button4.mousePressed(useCam);
  button4.parent(controller);


  userStartAudio();

  createFFT();
  createAmplitude();

  background(0);

}

function draw() {
  getMicVolume();
  let val = slider.value();
  micSlider = 10 * micVolume * val;


  pixelMove2 = map(micVolume*val, 0, 2, 0, img.width);

  pixelMove = constrain(pixelMove2, 0, img.width);

  let fontSize = map(micVolume*val, 0, 0.8, 0, 80);
  let fontLimit = constrain(fontSize, 0, 80);

  let fontFinal = fontLimit * multip;

  textAlign(CENTER, CENTER);

  textFont(fontName2, fontFinal);

  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(10);


  myAsciiArt = new AsciiArt(this);


  let e = img.get(pixelMove , 6);

  let o = img.get(pixelMove, img.height / 2);



  noStroke();


  let c = img.get(pixelMove , img.height / 2);
  let n = img.get(pixelMove, img.height / 2);


   if (millis() >= 500 + timer) {

    background(n);

    if(micVolume*val>0.3){

      changeImg();
    }

    timer = millis();
  } 

  fill(c);

  for (let i = 0; i < windowWidth; i += 500) {



    for (let y = 0; y < windowHeight; y += windowHeight / 100) {
      let wow = map(micVolume*val, 0, 2, 1, 500);



      rect(i*micVolume*val, y, wow * 1.2, 3);
      rect(i + windowWidth / 2, y, wow * 1.2, 3);

      fill(o);
      rect(i*micVolume*val + windowWidth, y, -wow * 1.2, 3);

      fill(e);

      rect(i*micVolume*val + windowWidth / 2, y, -wow * 1.3, 3);

      rect(i*micVolume*val + 400, y, wow * 1.3, 3);
    }
  }



  fill(0);



  if (myCapture !== null && myCapture !== undefined) {

    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);
    gfx.filter(POSTERIZE, 3);

    ascii_arr = myAsciiArt.convert(gfx);
    myAsciiArt.typeArray2d(ascii_arr, this);
  }

}

typeArray2d = function (_arr2d, _dst, _x, _y, _w, _h) {
  if (_arr2d === null) {
    console.log("[typeArray2d] _arr2d === null");
    return;
  }
  if (_arr2d === undefined) {
    console.log("[typeArray2d] _arr2d === undefined");
    return;
  }
  switch (arguments.length) {
    case 2:
      _x = 0;
      _y = 0;
      _w = width;
      _h = height;
      break;
    case 4:
      _w = width;
      _h = height;
      break;
    case 6:
      /* nothing to do */ break;
    default:
      console.log("[typeArray2d] bad number of arguments: " + arguments.length);
      return;
  }

  if (_dst.canvas === null) {
    console.log("[typeArray2d] _dst.canvas === null");
    return;
  }
  if (_dst.canvas === undefined) {
    console.log("[typeArray2d] _dst.canvas === undefined");
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext("2d");
  if (temp_ctx2d === null) {
    console.log("[typeArray2d] _dst canvas 2d context is null");
    return;
  }
  if (temp_ctx2d === undefined) {
    console.log("[typeArray2d] _dst canvas 2d context is undefined");
    return;
  }

  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for (var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for (var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/ temp_ctx2d.fillText(
      _arr2d[temp_x][temp_y],
      offset_x + temp_x * dist_hor,
      offset_y + temp_y * dist_ver
    );

};

function createAmplitude() {

  amplitude = new p5.Amplitude();
}

function getAmplitudemicVolume() {

  micVolume = amplitude.getmicVolume();
}


function createFFT() {
  // remember to call this function in setup
  // creates new p5 FFT constructor
  fft = new p5.FFT();
}

function createMic() {
  //create new p5 audioIn object
  //remember to put this function in set up
  mic = new p5.AudioIn();
  mic.start();
}

function getMicVolume() {

  micVolume = mic.getLevel();
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

function changeFont() {
  if (fontName == "Crosses.otf") {

    fontName = "flowers.otf";
    fontName2 = "flowers";

    myFont = loadFont(fontName);
  } else if (fontName == "flowers.otf") {
    fontName = "Hertz-Regular.otf";
    fontName2 = "Hertz-Regular";
    myFont = loadFont(fontName);
  } else if (fontName == "Hertz-Regular.otf") {


    fontName = "Crosses.otf";
    fontName2 = "Crosses";
    myFont = loadFont(fontName);
  }

}

function changeImg() {
  if (imgChoice == "band2.jpg") {
    imgChoice = "band10.png";
    img = loadImage(imgChoice);
    multip = 1.5;
    asciiart_width = 100;
    asciiart_height = 20;

  } else if (imgChoice == "band10.png") {
    imgChoice = "band5.jpg";
    img = loadImage(imgChoice);
    multip = 4;
    let r = random(1,4);
    let r2 = random(1,10);
    asciiart_width = 5;
    asciiart_height = 10;
  } else if (imgChoice == "band5.jpg") {
    imgChoice = "band2.jpg";
    img = loadImage(imgChoice);
    multip = 1;

    asciiart_width = 90;
    asciiart_height = 15;
  }
}




function handleFile(file) {

  if (file.type === 'video') {


    myCapture = createVideo([file.data, '']);
    myCapture.size(windowWidth / 2, windowHeight / 2);
    translate(6, 6);
    myCapture.loop();
    myCapture.hide();
    myCapture.volume(0)


  } else {

  }
}




function useCam() {

  myCapture = createCapture(VIDEO);
  myCapture.size(windowWidth, windowHeight);
  myCapture.hide();

}