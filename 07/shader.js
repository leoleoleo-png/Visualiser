var canvas;
var pixelator;
var myPalette;
var myFile;
let video;

let limitSlider;
let toleranceSlider;

let levelAccum = 0;
var a = 0;
let cam;


function preload() {


    imgChoice = '../input/puzzle.jpg';
    myFile = loadImage(imgChoice);
    video = createVideo("../input/sunset.mp4");
}

function setup() {
  
    audioSetup();

    fft.setInput(mic);

    let limitLabel = createP("Circle size");
    limitLabel.parent(controller)
    limitLabel.position(5, 40);

    limitSlider = createSlider(0.1, 10.1, 5.1, 1);
    limitSlider.parent(controller);
   


    let inputLabel = createP("Input your own image");
    inputLabel.parent(controller);
    inputLabel.position(5, 98);
    input = createFileInput(handleFile);
    input.parent(controller);
    let col = color(224, 224, 224,0);
    input.style('backgroundColor', col);
    input.style('color', '#F8F8FF');
    input.size(180, 30); 
 
 

    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // canvas.parent("sketch");
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

    /* pixelator = new Pixelator(window, canvas, {
        type: "blocks",
        palette: myPalette,
    }); */
    pixelatorStart();

    video.loop();
}


function pixelatorStart(){

    pixelator = new Pixelator(window, canvas, { type: "image", image: myFile }); // this type requires running on a server
    pixelator.parent("sketch");
}
function draw() {


    lights();
    background(0);
    audioDraw();

   

    video.volume(0);
    video.hide();
    video.loadPixels();

    push();
    translate(width/2, -height/2);
    scale(-1, 1);
/*     image(video, 0, 0, windowWidth, windowHeight); */
    pop();



    background(0);

    torus(40*limitSlider.value(), 20*micVolume*limitSlider.value());

    torus(4*limitSlider.value(), 100*micVolume*limitSlider.value());




    let mappedVolume = map(micVolume, 0, 0.6, 0.01, 0.4);

    pixelator.set({ range: mappedVolume*100});
    pixelator.set({ tolerance: limitSlider.value()/1000 });
    pixelator.update();


}

function mousePressed(){
     video.loop();
}

function handleFile(file) {

    if (file.type === 'image') {

   imgChoice = loadImage(file.data, '');

       

        
    } else {

    }
}