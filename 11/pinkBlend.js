let mic;
let mic2;

//AMPLITUDE
let amplitude;
let level;
let levelHistory = new Array(30);

let img;
let img2;

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
  fontName = "crosses.otf";
  fontName2 = "crosses";
  imageChoice = "band5.jpg";
  myFont = loadFont(fontName);

  img = loadImage("imagecool.jpg");
  img2 = loadImage(imageChoice);
}

function setup() {

  mic = new p5.AudioIn();
  mic.start();

  textColour = 0;

  createCanvas(windowWidth, windowHeight);

  myCapture = createVideo(
    ["backflipo.mov", "backflipo.ogv", "backflipo.webm"],
    myCapture
  );

  myCapture.size(windowWidth / 2, windowHeight);
  myCapture.loop();
  myCapture.volume(0);
  myCapture.hide();

  // we need some space...
  //initCaptureDevice(); // and access to the camera
  /*
    In this particular case the gfx helper should have dimensions the same as
    the target graphic.
  */
  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(1);
  /*
    Here we create an object derived from the AsciiArt pseudo-class from the
    p5.asciiart library:
      new AsciiArt(_sketch);
      new AsciiArt(_sketch, _fontName);
      new AsciiArt(_sketch, _fontName, _fontSize);
      new AsciiArt(_sketch, _fontName, _fontSize, _textStyle);
  */
  myAsciiArt = new AsciiArt(this);
  /*
    After initializing the object, look at (in the console) the listing of the
    array containing the glyphs sorted according to the amount of space
    occupied. This table is the basis for the procedure that converts
    individual image pixels into glyphs.
  */

  //myAsciiArt.printWeightTable();

  /*
    Here we set the font family, size and style. By default ASCII Art library
    is using 'monospace' font, so we want to apply the same setting to our
    sketch.
  */

  createAmplitude();

  frameRate(30);
}

function draw() {
  getMicVolume();
  //MAP MIC VOLUME TO 0.1->4
  micMapped = map(micVolume, 0, 0.2, 0.1, 4);

  fillThreshold = map(micMapped, 0, 4, 1, 100);

  pixelMove = map(micVolume, 0, 0.2, 1, img.width);

  fontSize = ceil(map(micMapped * 5, 0, 4, 0, 10));

  let fontLimit = constrain(fontSize, 1, 30);

  let pixelLimit = constrain(pixelMove, 0, img2.width);

  // if (mouseIsPressed) {
  //   //colourOptionA();
  // }

  textAlign(CENTER, CENTER);
  textFont(fontName2, fontLimit);
  textStyle(BOLD);

  noStroke();

  let recWid = constrain(map(micMapped, 0, 1, 3, 10), 5, 20);

  for (let i = 0; i < windowWidth; i += windowWidth / recWid) {
    let c = img2.get(i, 0);
    fill(c);



    for (let y = 0; y < windowHeight; y += windowHeight / 100) {
      let wow = map(micMapped, 0, 4, 1, 300);
      rect(i, y * micMapped, wow, 3);
    }
  }


    fill(0);
 
  if (myCapture !== null && myCapture !== undefined) {
    // safety first

    /*
      Let's prepare the image for conversion. Although the object derived from
      the AsciiArt pseudo-class has it's own mechanism of changing the size of
      the image, we will use the external one. Thanks to this we will be able -
      before transferring the image for conversion - to perform the posterize
      effect on it, which will make the final effect better.
    */
    //gfx.background(0);
    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);

    /*
      It is worth experimenting with the value of the parameter defining the
      level of posterization. Depending on the characteristics of the image,
      different values may have the best effect. And sometimes it is worth not
      to apply the effect of posterization on the image.
    */
    gfx.filter(POSTERIZE, 2);
    /*
      Here the processed image is converted to the ASCII art. The convert()
      function in this case is used with just one parameter (image we want to
      convert), so the resultant ASCII graphics will have the same resolution
      as the image. If necessary (especially if the resolution of the converted
      image is relatively high), it is possible to use the converter function
      in the version with three parameters: then the second and third
      parameters will be respectively the width and height of the generated
      glyph table. The convert() function returns a two-dimensional array of
      characters containing the representation of the converted graphics in the
      form of the ASCII art. If the conversion fails, the function returns
      null.
    */
    ascii_arr = myAsciiArt.convert(gfx);
    /*
      We can only watch ASCII art or display it against the background of the
      original image from the camera. The flag controlling the display of the
      image coming from the camera is switched by tap/click.
    */

    /*
      Now it's time to show ASCII art on the screen. First, we set drawing
      parametrs. Next, we call the function typeArray2d() embedded in the
      ASCII Art library, that writes the contents of a two-dimensional array
      containing (implicitly) text characters (chars) on the screen. In this
      case, we call a function with 2 parameters: the first is the table
      whose contents we want to print, and the second is the destination (an
      object with "canvas" property). If you use the function with two
      parameters (as we do in this example), it will assume that you need to
      fill the entire surface of the target canvass with a drawing. However,
      the function can be called in 3 variants:
        [AsciiArt instance].typeArray2d(_arr2d, _dst);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y, _w, _h);
      The parameters are as follows:
        _arr2d - 2-dimentional array containing glyphs (chars)
        _dst - destination (typically the sketch itself)
        _x, _y - coordinates of the upper left corner
        _w, _h - width and height
      It is relatively easy to write your own function that formats the contents
      of an array to ASCII graphics. At the end of this example, I glue the
      function code from a non-minimized version of the library - it can be
      used as a base for your own experiments.
    */
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
  /*
    Because Safari in macOS seems to behave strangely in the case of multiple
    calls to the p5js text(_str, _x, _y) method for now I decided to refer
    directly to the mechanism for handling the canvas tag through the "pure"
    JavaScript.
  */
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
  // creates p5 amplitude constructor
  // remember to call this function in setup
  amplitude = new p5.Amplitude();
}

function getAmplitudeLevel() {
  // remember to delare global variable: let level;
  // stores amplitude values in variable level
  // values range from 0 to 1 but realistically from 0 to 0.6~
  level = amplitude.getLevel();
}

function getMicVolume() {
  //stores miclevels in variable micVolume
  //values range from 0 to 1
  micVolume = mic.getLevel();
}

// *.* BUTTONS FRENZY *.*

// FONT OPTIONS A B C !!!

function fontChangeA() {
  fontName = "Hertz-Regular.otf";
  fontName2 = "Hertz-Regular";
  myFont = loadFont(fontName);
}

function fontChangeB() {
  fontName = "heart sweet heart.ttf";
  fontName2 = "heart sweet heart";
  myFont = loadFont(fontName);
}

function fontChangeC() {
  fontName = "Crosses.otf";
  fontName2 = "Crosses";
  myFont = loadFont(fontName);
}

let fillIsBlack = true;
