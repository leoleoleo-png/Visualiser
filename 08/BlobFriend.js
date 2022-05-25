/* =============== */
/*    VARIABLES    */
/* =============== */






var colorState = 1;
//FFT

let spectrum;
let binAmplitude;
let bass, lowMid, mid, highMid, treble;
let waveform;

//AMPLITUDE
let amplitude;
let level;
// let levelHistory = new Array(30);

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

//UI

let micSlider;

// variables

const globe = [];
let levelHistory = [];
let r = 50;
let total = 20;
let angleX = 0;
let angleY = 0;

function setup() {


    let limitLabel = createP("Sensitivity");

    limitLabel.parent(controller);

    limitLabel.position(10, 40);
    micSlider = createSlider(0.05, 0.4, 0.23, 0.05);


    micSlider.parent(controller);

    sel = createSelect();
    sel.option("Lines");
    sel.option("Polygons");
    sel.option("Cross-section");
    sel.option("Dots");
    sel.option("Wire");
    sel.changed(selectEvent);
    sel.parent(controller);
    sel.size(180, 30);

    button2 = createButton('Background');
    button2.size(180, 30);
    button2.mousePressed(changeBackgroundColor);
    button2.parent(controller);

    let shapeLabel = createP("Shape option");

    shapeLabel.parent(controller);

    shapeLabel.position(10, 93);



    createCanvas(windowWidth, windowHeight, WEBGL);

    colorMode(HSB, 360, 100, 100, 1);

    createMic();

    createEasyCam();

    // suppress right-click context menu
    document.oncontextmenu = function () {
        return false;
    };
}

let a = 1;
let b = 1;

function superShape(theta, m, n1, n2, n3) {
    let s1 = abs((1 / a) * cos((m * theta) / 4));
    s1 = pow(s1, n2);

    let s2 = abs((1 / b) * sin((m * theta) / 4));
    s2 = pow(s2, n3);

    let s3 = s1 + s2;
    let r = pow(s3, -1 / n1);
    return r;
}

function selectEvent() {
    if (sel.value() == "Cross-section") {
    }
}

function draw() {


    if (colorState == 1) {
        background(224, 224, 224, 0);

    } else if (colorState == 2) {
        background('black');

    }



    getMicVolume();
    levelHistory.push(micVolume);
    if (levelHistory.length > total) {
        levelHistory.splice(0, 1);
    }
    micWarp = micVolume * 100;

    rotateY(HALF_PI * 1.5);
    rotateX(HALF_PI * 1.5);

    noFill();
    fill(mouseX % 360, 100, 100);
    strokeWeight(2);
    stroke(mouseY & 360, 100, 100);

    for (let i = 0; i < total + 1; i++) {
        let lerpLevel = lerp(levelHistory[i], levelHistory[i + 1], 0.9);
        let displace = map(lerpLevel, 0, micSlider.value(), 1, 600);

        globe[i] = [];
        const lat = map(i, 0, total, -HALF_PI, HALF_PI);
        let r2 = superShape(
            lat,
            2 + mouseY,
            map(mouseY, height, 0, -10, 100),
            10,
            10
        );

        for (let j = 0; j < total + 1; j++) {
            r = 75 + displace;

            const lon = map(j, 0, total, -PI, PI);
            let r1 = superShape(
                lon,
                8 + mouseX,
                map(mouseX, width, 0, -10, 100),
                100,
                30
            );
            const x = r * r1 * cos(lon) * r2 * cos(lat);
            const y = r * r1 * sin(lon) * r2 * cos(lat);
            const z = r * r2 * sin(lat);

            globe[i][j] = createVector(x, y, z);
        }
    }

    if (sel.value() == "Lines") {
        lines();
    } else if (sel.value() == "Cross-section") {
        crossSection();
    } else if (sel.value() == "Polygons") {
        polygons();
    } else if (sel.value() == "Dots") {
        dots();
    } else if (sel.value() == "Wire") {
        wire();
    }
}

function lines() {
    for (let i = 0; i < total; i++) {
        beginShape(LINES);
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
    }

    for (let i = 0; i < total; i++) {
        beginShape(POINTS);
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
    }
}

function crossSection() {
    for (let i = 0; i < total; i++) {
        beginShape();
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
        }
        endShape();
    }
}

function polygons() {
    for (let i = 0; i < total; i++) {
        beginShape(TRIANGLE_STRIP);
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
    }
}

function dots() {
    for (let i = 0; i < total; i++) {
        strokeWeight(6);
        beginShape(POINTS);
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
    }

    for (let i = 0; i < total; i++) {
        noStroke();
        beginShape();
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
    }
}

function wire() {
    for (let i = 0; i < total; i++) {
        beginShape(QUADS);
        for (let j = 0; j < total + 1; j++) {
            const v1 = globe[i][j];
            vertex(v1.x, v1.y, v1.z);
            const v2 = globe[i + 1][j];
            vertex(v2.x, v2.y, v2.z);
        }
        endShape();
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

function loaded() {
    button = createButton("toggle mic");
    button.mousePressed(toggleSong);
}

function toggleSong() {
    if (playing) {
        song.pause();
        playing = false;
    } else {
        song.play();
        playing = true;
    }
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

// function recordLevelHistory(){
//     // remember to define: let levelHistory = new Array(length of array);
//     // add new level to end of array
//     levelHistory.push(level);

//     // remove first item in array
//     levelHistory.splice(0, 1);
// }

function drawLevelHistory() {
    // loop through levelHistory[]
    for (let i = 0; i < levelHistory.length; i++) {
        rectMode(CENTER);

        let x = map(i, levelHistory.length, 0, width / 2, width);
        let h = map(levelHistory[i], 0, 0.5, 2, height);

        let spacing = 10;
        let w = width / (levelHistory.length * spacing);

        fill(0);
        rect(x, height / 2, w, h);
        rect(width - x, height / 2, w, h);
    }
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
    //define what should happen onBeat here
}


function changeBackgroundColor() {
    if (colorState == 1) {
        colorState = 2;
    } else if (colorState == 2) {
        colorState = 1;
    }
}