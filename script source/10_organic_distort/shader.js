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

let theShader;
let cam
let textureImage;

function preload() {
    theShader = loadShader(
        "10_organic_distort/shader.vert",
        "10_organic_distort/shader.frag"
    );
    textureImage = loadImage('flowers.jpg')
}

function setup() {
    createCanvas(500, 500, WEBGL);
    noStroke()
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

    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount);
    theShader.setUniform("u_texture", textureImage);
    theShader.setUniform("u_mouseCoord", map(mouseX, 0, width, 2, 50));
    theShader.setUniform("u_micVolume", map(micVolume, 0, 1, 0, 10));

    theShader.setUniform("u_texelSize", [1.0 / width, 1.0 / height]);

    shader(theShader);

    rect(-width/2, -height/2, width, height);

}
