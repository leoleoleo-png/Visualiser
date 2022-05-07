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
    manualFrameCount += random(250);
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
        "04_3Ddisplacement/preset1/shader.vert",
        "04_3Ddisplacement/preset1/shader.frag"
    );
}

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(500, 500, WEBGL);
    noStroke();
        emptyAudioFile = loadSound("empty.mp3");
        audioSetup();
        fft.setInput(mic);
}

function draw() {
    audioDraw();
    detectBeat(micVolume);
    background(0);
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

    manualFrameCount += 0.001;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    
}
