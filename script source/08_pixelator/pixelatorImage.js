var canvas;
var pixelator;
var myPalette;
var myFile;
let video;

let limitSlider;
let toleranceSlider;

let levelAccum = 0;

let cam;

function preload() {
    myFile = loadImage("flowers.jpg");
    video = createVideo("road.mp4");
}

function setup() {
    // cam = createCapture(VIDEO);
    // cam.size(64, 64);
    // cam.hide();

    emptyAudioFile = loadSound("empty.mp3");

    audioSetup();
    fft.setInput(mic);

    createP("SPRITE AMOUNT");
    limitSlider = createSlider(0, 1, 0.31, 0.01);

    createP("TOLERANCE AMOUNT");
    toleranceSlider = createSlider(0, 1, 0.05, 0.01);

    canvas = createCanvas(1024, 512, WEBGL);
    canvas.parent("sketch");
    canvas.hide();

    // myPalette = [
    //     color("#5c0423"),
    //     color("#02205e"),
    //     color("#453a14"),
    //     color("#2d260c"),
    //     color("#451a0b"),
    //     color("#0b3b8d"),
    //     color("#171717"),
    //     color("#1e1e20"),
    //     color("#212025"),
    //     color("#2664c7"),
    //     color("#3b3a38"),
    //     color("#91cec9"),
    //     color("#9e9171"),
    //     color("#9fd4ca"),
    //     color("#b89a20"),
    //     color("#c70b23"),
    //     color("#cecdc9"),
    //     color("#d0b7ba"),
    //     color("#d6e8fc"),
    //     color("#d8d5d0"),
    //     color("#e86d1f"),
    //     color("#e8eeea"),
    //     color("#ec4942"),
    //     color("#f5e865"),
    //     color("#f697c3"),
    //     color("#fa79b9"),
    //     color("#fbe343"),
    //     color("#fc6320"),
    //     color("#fecb3c"),
    // ];

    myPalette = [
        color("#FFFFFF"),
        color("#020202"),
        color("#B21AF9"),
        color("#90F2D3"),
        color("#F69A21"),
        color("#0F7898"),
    ];

    // pixelator = new Pixelator(window, canvas);
    // pixelator = new Pixelator(window, canvas, { type: "gradients", palette: myPalette });
    // pixelator = new Pixelator(window, canvas, {
    //     type: "blocks",
    //     palette: myPalette,
    // });
    pixelator = new Pixelator(window, canvas, { type: "image", image: myFile }); // this type requires running on a server
    pixelator.parent("sketch");
}

function draw() {
    lights();
    background(100);
    audioDraw();

    // push();
    // translate(width/2, -height/2);
    // scale(-1, 1);
    // image(cam,0,0,width,height)
    // pop();

   
    video.volume(0);
    video.hide();

    video.loadPixels();

    push();
    translate(width/2, -height/2);
    scale(-1, 1);
     image(video, 0, 0);
    pop();

    // filter(THRESHOLD,0.2)

    levelAccum = levelAccum + micVolume;

    // rotateX(levelAccum * 0.1);
    // rotateY(levelAccum * 0.1);
    // print(micVolume)
    // strokeWeight(0);
    // torus(200, 200);
    // box(240);

    let mappedVolume = map(micVolume, 0, 0.6, 0.2, 0.4);

    pixelator.set({ range: mappedVolume });
    pixelator.set({ tolerance: toleranceSlider.value() });
    pixelator.update();
}

function mousePressed(){
     video.loop();
}