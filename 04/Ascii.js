let mic;
let slider;
let slider2;

let fileInput;

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

var asciiart_width = 120;
var asciiart_height = 30;

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

  imgChoice = "band.jpg"
  img = loadImage(imgChoice);


}

function setup() {

  mic = new p5.AudioIn();
  mic.start();


  slider = createSlider(100, 500, 300);




  button2 = createButton('Change font');
  button2.mousePressed(changeFont);
  button2.size(170, 30);

  button = createButton('Change colors');
  button.mousePressed(changeImg);
  button.size(170, 30);

  slider.parent(controller);


  button2.parent(controller);
  button.parent(controller);



  imageMode(CENTER);

  createCanvas(windowWidth, windowHeight);

  userChoice = "backflipo.mov";
  myCapture = createVideo(
    [userChoice],
    myCapture
  );

  myCapture.size(windowWidth /2, windowHeight);
  myCapture.loop();
  myCapture.volume(0);
  myCapture.hide();




  fileInput = createFileInput(handleFile);
  fileInput.size(170, 30);
  let col = color(224, 224, 224,0);
  fileInput.style('backgroundColor', col);

  fileInput.parent(controller);


  userStartAudio();

  createFFT();
  createAmplitude();

  frameRate(30);
  background(0);

}

function draw() {

  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(3);

  myAsciiArt = new AsciiArt(this);
  getMicVolume();

  let val = slider.value();
  
  micSlider = micVolume * val;


  fillThreshold = map(micSlider, 0, 10, 1, 100);

  pixelMove = map(micSlider, 1, 80, 2, img.width);

  fontSize = map(micSlider, 0, 50, 0, 100);

  let fontLimit = constrain(fontSize, 10, 100);

  textAlign(CENTER, CENTER);

  textFont(fontName2, fontLimit);










  noStroke();

  let c = img.get(pixelMove / 2, 5);

  for (let i = 0; i < windowWidth; i += windowWidth) {



    fill(c);

    for (let y = 0; y < windowHeight; y += windowHeight / 100) {
      let wow = map(micSlider, 0, 4, 1, 200);
      rect(i * micSlider, y, wow, micSlider / 5);


      rect(windowWidth / 2 + i * micSlider, y, wow, micSlider / 10);
    }
  }


  fill(0);



  if (myCapture !== null && myCapture !== undefined) {



    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);


    gfx.filter(POSTERIZE, 2);

    ascii_arr = myAsciiArt.convert(gfx);

    myAsciiArt.typeArray2d(ascii_arr, this);
  }


  //stroke(c);



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
  }else if (fontName == "Hertz-Regular.otf") {


    fontName = "Crosses.otf";
    fontName2 = "Crosses";
    myFont = loadFont(fontName);
  }

}

function changeImg() {
  if (imgChoice == "band.jpg") {
    imgChoice = "band2.jpg";
    img = loadImage(imgChoice);
  } else if (imgChoice == "band2.jpg") {
    imgChoice = "band6.jpg";
    img = loadImage(imgChoice);
  }else if (imgChoice == "band6.jpg") {
    imgChoice = "band.jpg";
    img = loadImage(imgChoice);}
}




function handleFile(file) {

  if (file.type === 'video') {


      myCapture = createVideo([file.data, '']);
      myCapture.size(windowWidth/2, windowHeight);

      myCapture.loop();
      myCapture.hide();
      myCapture.volume(0)
  } else {

  }
}