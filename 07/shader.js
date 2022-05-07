let theShader;

let mainTexture;
let distortTexture

function preload() {
    // load the shader
    theShader = loadShader(
        "shader.vert",
        "shader.frag"
    );

    mainTexture = loadImage("../input/flowers.jpg");
    distortTexture = loadImage("../input/tree2.jpg");
}

function mousePressed() {
    togglePlay();
}

function setup() {
    // shaders require WEBGL mode to work
    audioSetup()
    emptyAudioFile = loadSound("../input/empty.mp3", loaded);

    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    shaderTexture = createGraphics(1, 1000, WEBGL);

    shaderTexture.noStroke();
}

function draw() {
  audioDraw()

    shaderTexture.shader(theShader);

    // shader() sets the active shader with our shader
    shader(theShader);

    theShader.setUniform("u_resolution", [width, height]);

    // lets just send the cam to our shader as a uniform
    theShader.setUniform("u_mainTexture", mainTexture);

    theShader.setUniform("u_distortTexture", distortTexture);

    theShader.setUniform("u_amt", map(micVolume, 0.0, 1, 0, 1));

    theShader.setUniform("u_resolution", [width, height]);

    shaderTexture.rect(0, 0, width, height);

    background(255);

    texture(shaderTexture);

    translate(-width / 2, -height / 2, 0);

    // rect gives us some geometry on the screen
    rect(0, 0, width, height);

    // copy(shaderTexture, width/2,500,30,500,0,0,width,200);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
}
