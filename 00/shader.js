/* =========== */
/* BEAT DETECT */
/* =========== */



let micSens;
var sliderVol;
function detectBeat(level) {
    //level should be from 0 to 1 (realistically 0 to 0.6~)
    //detect if level exceeds beatThreshold and beatCutoff
    //if not advance the frames
    sliderVol = micSens.value();



    if (level > beatCutoff&&level > beatThreshold) {
        onBeat();
        beatCutoff = micVolume * 1.1;
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

    if (frameCount % 25 == 0) {
        manualFrameCount += random(250);
    }
}

//this variable will hold our shader object

let myShader;
let manualFrameCount = 0;

function preload() {
    // a shader is composed of two parts, a vertex shader, and a fragment shader
    // the vertex shader prepares the vertices and geometry to be drawn
    // the fragment shader renders the actual pixel colors
    // loadShader() is asynchronous so it needs to be in preload
    // loadShader() first takes the filename of a vertex shader, and then a frag shader
    // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
    myShader = loadShader(
        "shader.vert",
        "shader.frag"
    );
}

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
    audioSetup();
    fft.setInput(mic);


    let limitLabel = createP("Sensitivity");

    limitLabel.parent(controller);
    limitLabel.position(10, 40);
    micSens = createSlider(1 / 10, 3.1, 1.6, 0.2);
    micSens.parent(controller);
    background(0);
}

function draw() {

    audioDraw();

    sliderVol = micSens.value();
    let mix = sliderVol * micVolume;
    detectBeat(mix);




    // shader() sets the active shader with our shader
    shader(myShader);

    // Send the frameCount to the shader
    myShader.setUniform("uFrameCount", manualFrameCount);

    // Rotate our geometry on the X and Y axes
    rotateX(100);
    rotateY(100);

    // Draw some geometry to the screen
    // We're going to tessellate the sphere a bit so we have some more geometry to work with
    sphere(width / 5, 200, 200);
    sphere(50, 10, 200);



    //sphere(40, detailX.value()*micVolume, 16);

    //sphere(width / 5, 200, 3);



    manualFrameCount += 0.001;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

