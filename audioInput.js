/* =============== */
/*    VARIABLES    */
/* =============== */

let button;
let playing;


// INPUT

let mic;
let micVolume;
let emptyAudioFile;
let song;
let inputMic

//FFT
let fft;
let spectrum;
let binAmplitude
let bass, lowMid, mid, highMid, treble;
let waveform

//AMPLITUDE
let amplitude;
let amplitudeLevel


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

/* ================ */
/* CUSTOM FUNCTIONS */
/* ================ */

/* ================ */
/*      INPUT       */
/* ================ */

function createMic(){
    //create new p5 audioIn object
    //remember to put this function in set up
    mic = new p5.AudioIn();
    mic.start();
}

function getMicVolume(){
    //stores mic levels in variable micVolume
    //values range from 0 to 1
    micVolume = mic.getLevel()*10;
    //needs to be scaled up because mic input is usually really quiet
}

function loaded() {
    let onButton = createButton("ON");
    onButton.parent(controller);
    onButton.mousePressed(startAudioContext);
}

function startAudioContext() {
    emptyAudioFile.play();
    print('audio context started')
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

function toggleInput() {
    if (inputMic) {
        fft.setInput(song);
        inputMic = false;
    } else {
        fft.setInput(mic);
        inputMic = true;
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

function getAmplitudeLevel(){
    // remember to delare global variable: let level;
    // stores amplitude values in variable level
    // values range from 0 to 1 but realistically from 0 to 0.6~
    amplitudeLevel = amplitude.getLevel();
}

/* ==========*/
/*    FFT    */
/* ========= */

function createFFT(smoothing,bins){
    // remember to call this function in setup
    // creates new p5 FFT constructor
    fft = new p5.FFT(smoothing,bins);
}

function FFTAnalyse() {
    // remember to delare global variable: let spectrum;
    // stores FFT analysis array in variable spectrum
    spectrum = fft.analyze();
}

function FFTgetEnergy() {
    //remember to define global vairables: let bass, lowMid, mid, highMid, treble;
    // stores volume at a specific frequency in respective variables
    // values go from 0 to 255 but are mapped from 0 to 1
    bass = map(fft.getEnergy("bass"),0,255,0,1);
    lowMid = map(fft.getEnergy("lowMid"),0,255,0,1);
    mid = map(fft.getEnergy("mid"),0,255,0,1);
    highMid = map(fft.getEnergy("highMid"),0,255,0,1);
    treble = map(fft.getEnergy("treble"),0,255,0,1);
}

function FFTgetWaveform() {
    //remember to define global variable: let waveform;
    // stores FFT waveform data in variable waveform 
    waveform = fft.waveform();
}

function audioSetup() {
    createMic();
    createAmplitude();
    createFFT();
}

function audioDraw() {
    getAmplitudeLevel();
    getMicVolume();
    FFTAnalyse();
    FFTgetEnergy();
    FFTgetWaveform();
}