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
    move = random(0.5);

    if(nextBeat){
        nextBeat = false
    } else {
        nextBeat = true
    }
}

/* =============== */
/*    WORK AREA    */
/* =============== */

let theShader;
let cam;
let paintingImage;
let move;
let nextBeat = true;

function preload() {
    theShader = loadShader(
        "02_striped_pixels/shader.vert",
        "02_striped_pixels/shader.frag"
    );

    paintingImage = loadImage('displace3.jpg');
}

function setup() {
    createCanvas(500, 500, WEBGL);
    noStroke();
    emptyAudioFile = loadSound("empty.mp3");
    audioSetup();
    fft.setInput(mic);

    cam = createCapture(VIDEO);
    cam.size(windowWidth, windowHeight);
    cam.hide();
}

function draw() {
    background(240, 89, 10);
    audioDraw();
    detectBeat(micVolume)

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_camTexture", paintingImage);
    theShader.setUniform("u_mouseCoord", [
        map(mouseX, 0, width, 0, 1),
        map(mouseY, 0, height, 0, 1),
    ]);
    theShader.setUniform("u_micVolume", micVolume);
    theShader.setUniform("u_move", [move, move]);
    theShader.setUniform("u_nextBeat", nextBeat);

    shader(theShader);

    rect(0, 0, width, height);
}
