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
        amp = -0.15;
        move = random(0.75);
}

/* =============== */
/*    WORK AREA    */
/* =============== */

let theShader;
let cam;
let paintingImage;
let move;
let amp = 0;

function preload() {
    theShader = loadShader(
        "03_displacement/shader.vert",
        "03_displacement/shader.frag"
    );
    paintingImage = loadImage('puzzle.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
    emptyAudioFile = loadSound("empty.mp3");
    audioSetup();
    fft.setInput(mic);

    cam = createCapture(VIDEO);
    cam.size(windowWidth, windowHeight);
    cam.hide();

    move = 0.25;
}

function draw() {
    background(240, 89, 10);
    audioDraw();
    detectBeat(micVolume)

    let freq = 10
    amp +=0.025

    let scale = map(mouseY, 0, height, 1, 4)

    // send the two values to the shader
    theShader.setUniform("u_frequency", freq);
    theShader.setUniform("u_amplitude", amp);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_camTexture", paintingImage);
    theShader.setUniform("u_mouseCoord", map(mouseX, 0, width, 0, 1));
    theShader.setUniform("u_micVolume", map(micVolume, 0, 1, 0, 10));
    theShader.setUniform("u_scale", scale);
    theShader.setUniform("u_move", [move,move]);

    shader(theShader);

    rect(0, 0, width, height);
}

function mousePressed(){
    amp = -0.15;
    move = random(0.75);
    emptyAudioFile.play()
}