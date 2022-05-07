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

/* =============== */
/*    WORK AREA    */
/* =============== */

function setup() {
    createMic()
    createFFT()
    
    createCanvas(windowWidth, windowHeight);
    emptyAudioFile = loadSound("../input/empty.mp3", loaded);
    fft.setInput(mic);

}

let x = 0;
let y = 0;
let Xinc = 1;
let Yinc = 1;

function draw() {
    background(0);
    getMicVolume();
    FFTAnalyse();
    FFTgetWaveform();
    detectBeat(micVolume);
    textStyle(BOLD);

    textAlign(CENTER, CENTER);
    fill(255);

 

    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);

        textSize(width / 100);
        text("SELECT", x*10, y);
    }

    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);

        textSize(width / 50);
        text("SELECT", x * 100, y * 1.25);
    }

    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);

        textSize(width / 50);
        text("SELECT", x * 100, y*0.75);
    }

    
}
