/* =============== */
/*    VARIABLES    */
/* =============== */

let mic;

let button;

let fileInput;
let img;


var distortion = 2;


let varX;
let varY;

//FFT
let fft;
let spectrum;
let binAmplitude
let bass, lowMid, mid, highMid, treble;
let waveform

//AMPLITUDE
let amplitude;
let level
let levelHistory = new Array(30);




//BEAT DETECT

// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
let beatHoldFrames = 30;

// what amplitude level can trigger a beat?
let beatThreshold = 0.3;

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
let beatCutoff = 0;
let beatDecayRate = 0.98; // how fast does beat cutoff decay?
let framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.


/* =============== */
/*    WORK AREA    */
/* =============== */

let skate;
var stepSize;

let slider;


var userChoice = 'sunset.mp4';

function setup() {

    createCanvas(windowWidth, windowHeight);
    pixelDensity(2);

    // specify multiple formats for different browsers

    skate = createVideo([userChoice]);
    skate.size(windowWidth, windowHeight);


    skate.loop();
    skate.hide();
    skate.volume(0)



    mic = new p5.AudioIn();
    mic.start();

    userStartAudio();

    createFFT();
    createAmplitude();


    let limitLabel = createP("Sensitivity");
    limitLabel.parent(controller);
    limitLabel.position(10, 40);

    slider = createSlider(0, 150, 75);
    slider.parent(controller);


    button3 = createButton('Distortion direction');
    button3.size(180, 30);
    button3.mousePressed(distortionDirection);
    button3.parent(controller);

    button4 = createButton('Switch to camera');
    button4.size(180, 30);
    button4.mousePressed(useCam);
    button4.parent(controller);


    let inputLabel = createP("Add your own video");

    inputLabel.parent(controller);
    inputLabel.position(10, 170);

    fileInput = createFileInput(handleFile);
    fileInput.size(180, 30);
    let col = color(224, 224, 224, 0);
    fileInput.style('backgroundColor', col);

    fileInput.parent(controller);








}

let r = 200;
let g = 100;
let b = 255;

let r2 = 200;
let g2 = 190;
let b2 = 250;

function draw() {


    background(r, g, b);
    noStroke();
    getMicVolume();
    detectBeat(micVolume * 10);

    let val = slider.value();
    skate.loadPixels();

    micVolumeSlider = micVolume * val;
    let swag = map(micVolumeSlider, 0, 10, 10, 20);
    stepSize = 12;

    for (let y = 0; y < height; y += stepSize) {
        for (let x = 0; x < width; x += stepSize) {

            let i = y * width + x;
            let darkness = (255 - skate.pixels[i * 4]) / 200;
            let radius = micVolumeSlider * darkness * 5;

            fill(r2, g2, b2);

            varX = radius * map(micVolumeSlider, 1, 10, 0.5, 10);


            varY = radius + 1;
            ellipseMode(CENTER);

            if (distortion == 1) {
                ellipse(x, y, varY, varX);
            } else if (distortion == 2) {
                ellipse(x, y, varX, varY);
            }

        }
    }

}


/* ================ */
/* CUSTOM FUNCTIONS */
/* ================ */

function createMic() {
    //create new p5 audioIn object
    //remember to put this function in set up
    mic = new p5.AudioIn();
    mic.start();
}

function getMicVolume() {
    //stores mic levels in variable micVolume
    //values range from 0 to 1
    micVolume = mic.getLevel();
}


/* ========= */
/* AMPLITUDE */
/* ========= */


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

function recordLevelHistory() {
    // remember to define: let levelHistory = new Array(length of array);
    // add new level to end of array
    levelHistory.push(level);

    // remove first item in array
    levelHistory.splice(0, 1);
}

/* ==========*/
/*    FFT    */
/* ========= */

function createFFT() {
    // remember to call this function in setup
    // creates new p5 FFT constructor
    fft = new p5.FFT();
}

function FFTAnalyse() {
    // remember to delare global variable: let spectrum;
    // stores FFT analysis array in variable spectrum
    spectrum = fft.analyze();
}

function FFTdrawSpectrum() {
    for (let i = 0; i < spectrum.length; i++) {
        let binAmplitude = spectrum[i];
        let binHeight = map(binAmplitude, 0, 256, height, 0);
        w = width / 1024;
        rect(i * w, binHeight, w, height - binHeight);
    }
}

function FFTgetEnergy() {
    //remember to define global vairables: let bass, lowMid, mid, highMid, treble;
    // stores volume at a specific frequency in respective variables
    // values go from 0 to 255
    bass = fft.getEnergy("bass");
    lowMid = fft.getEnergy("lowMid");
    mid = fft.getEnergy("mid");
    highMid = fft.getEnergy("highMid");
    treble = fft.getEnergy("treble");
}

function FFTgetWaveform() {
    //remember to define global variable: let waveform;
    // stores FFT waveform data in variable waveform 
    waveform = fft.waveform();
}

function FFTdrawWaveform() {
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();
}

/* =========== */
/* BEAT DETECT */
/* =========== */

function detectBeat(level) {
    //level should be from 0 to 1 (realistically 0 to 0.6~)
    //detect if level exceeds beatThreshold and beatCutoff
    //if not advance the frames
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.1;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        } else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}



function onBeat() {
    r = random(200, 255);
    g = random(130, 255);
    b = random(0, 255);


    r2 = random(100, 255);
    g2 = random(100, 255);
    b2 = random(200, 255);
}






function distortionDirection() {
    if (distortion == 1) {
        distortion = 2;
    } else if (distortion == 2) {
        distortion = 1;
    }
}



function handleFile(file) {

    if (file.type === 'video') {

        skate = createVideo([file.data, '']);
        skate.size(windowWidth, windowHeight);
        skate.loop();
        skate.hide();
        skate.volume(0);
    } else {

    }
}


function useCam() {

    skate = createCapture(VIDEO);
    skate.size(windowWidth, windowHeight);
    skate.hide();

}