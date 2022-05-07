let mic;
let slider;
let slider2;


let amplitude;
let micVolume;
let micVolumeHistory = new Array(30);

var framed = 1;
var colorState = 1;
var bgState = 1;
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

var asciiart_width = 120;
var asciiart_height = 30;

var myCapture;


var gfx;

var ascii_arr;

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
  img = loadImage("band5.jpg");


}

function setup() {

  mic = new p5.AudioIn();
  mic.start();


  slider = createSlider(0, 200, 100);
  

  button = createButton('Text color');
  button.mousePressed(changeColorState);

  button2 = createButton('Background switch');
  button2.mousePressed(changeBackground);

  button3 = createButton('Shapes');
  button3.mousePressed(changeShapes);
  
  button.size(170, 30);
  button2.size(170, 30);
  button3.size(170, 30);

  slider.parent(controller);
  button.parent(controller);
  button2.parent(controller);
  button3.parent(controller);




  imageMode(CENTER);

  createCanvas(windowWidth, windowHeight);

  myCapture = createVideo(
    ["backflipo.mov", "backflipo.ogv", "backflipo.webm"],
    myCapture
  );

  myCapture.size(windowWidth / 2, windowHeight);
  myCapture.loop();
  myCapture.volume(0);
  myCapture.hide();






  userStartAudio();

  createFFT();
  createAmplitude();

  frameRate(30);

}

function draw() {

  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(3);

  myAsciiArt = new AsciiArt(this);
  getMicVolume();

  let val = slider.value();
  if (shapes == 1) {

    asciiart_width = 120;
    asciiart_height = 30;
  } else if (shapes == 2) {

    asciiart_width = 10;
  } else if (shapes == 3) {

    asciiart_width = 10;
    asciiart_height = 10;
  }



  micSlider = micVolume * val;

  fillThreshold = map(micSlider, 0, 10, 1, 100);

  pixelMove = map(micVolume, 0, 0.5, 0, img.width);

  fontSize = map(micSlider, 0, 10, 0, 150);

  let fontLimit = constrain(fontSize, 10, 100);

  textAlign(CENTER, CENTER);
  
  textFont(fontName2, fontLimit);






  if (bgState == 1) {
    let e = img.get(pixelMove, 2);
    fill(e);





    background(e);







  } else if (bgState == 2) {
    background(0);

  }
  else if (bgState == 3) {



  }




  noStroke();

  let c = img.get(pixelMove/2, 5);


  if (colorState == 1) {
    fill(c);

  } else if (colorState == 2) {

    fill(0);
  } else if (colorState == 3) {
    fill(255);
  }



  if (myCapture !== null && myCapture !== undefined) {



    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);


    gfx.filter(POSTERIZE, 2);

    ascii_arr = myAsciiArt.convert(gfx);

    myAsciiArt.typeArray2d(ascii_arr, this);
  }


  stroke(c);



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


function changeColorState() {
  if (colorState == 1) {
    colorState = 2;
  } else if (colorState == 2) {
    colorState = 3;
  } else if (colorState == 3) {
    colorState = 1;
  }

}

function changeBackground() {
  if (bgState == 1) {
    bgState = 2;
  } else if (bgState == 2) {
    bgState = 3;
  } else if (bgState == 3) {
    bgState = 1;
  }

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