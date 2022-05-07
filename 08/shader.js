//RANDOM COLOUR FILL
let colour1;

// the shader variable
let theShader;

// the camera variable
let video;

// we will need at least two layers for this effect
let shaderLayer;
let copyLayer;

function preload() {
    // load the shader
    theShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
    audioSetup();
    emptyAudioFile = loadSound("../input/empty.mp3", loaded);
    createCanvas(windowWidth, windowHeight);
    noStroke();

    video = createVideo('../input/birds.mp4', camLoad);

    video.size(width, height);

    // hide the html element that createCapture adds to the screen
    video.hide();

    // this layer will use webgl with our shader
    shaderLayer = createGraphics(windowWidth / 2, windowHeight / 2, WEBGL);

    // this layer will just be a copy of what we just did with the shader
    copyLayer = createGraphics(windowWidth, windowHeight);

    //LOWER FRAMERATE SMOOTHER BC VIDEO PROCESSING
    frameRate(30);
}

function draw() {
    audioDraw()

    //SET MIC THRESHOLD :
    //MY MIC DOESNT GO ABOVE 0.2 WHEN PLAYING MUSIC
    //SO I STRETCH 0->0.2 TO A 0->1.0 SCALE
    let micVolumeClamped = map(micVolume, 0.0, 0.2, 0.0, 1.0);

    //FOR FOR LOOP
    vol2 = ceil(map(micVolumeClamped, 0.0, 1.0, 1, 30));

    //SEND TO SHADER
    vol3 = map(micVolumeClamped, 0, 0.6, 0, 1.0);

    col1 = random(0, 1);
    // shader() sets the active shader with our shader
    shaderLayer.shader(theShader);

    // lets just send the cam to our shader as a uniform
    theShader.setUniform("u_videoTexture", video);

    // also send the copy layer to the shader as a uniform
    theShader.setUniform("u_copyTexture", copyLayer);
    theShader.setUniform("colour1", colour1);
    theShader.setUniform("time", frameCount * 0.01);
    theShader.setUniform("mic", vol3);

    // rect gives us some geometry on the screen
    shaderLayer.rect(0, 0, width, height);

    // draw the shaderlayer into the copy layer
    copyLayer.image(shaderLayer, 0, 0, width, height);

    // render the shaderlayer to the screen

    //DUPLICATING VIDEOS

    for (let x = 0; x < width; x += width / vol2) {
        image(shaderLayer, x, 0, width / vol2, height);
    }

    //TOP LAYER COPY, PAINTERLY STRETCH
    if (vol2 > 15) {
        image(shaderLayer, 0, 0, width * 100, height);
    }

    if (vol2 > 12) {
        if (frameCount % 3 == 0) {
            image(shaderLayer, 0, 0, width * 1.6, height);
        }

        if (vol2 > 12) {
            if (frameCount % 3 == 0) {
                colour1 = random(0.0, 1.0);
                fill(255, 0, 0, 30);
                rect(0, 0, width, height);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function camLoad() {
    video.loop();
    video.volume(0);
}

// function videoSwitch(){

//   cam = createVideo(['skate.mp4', 'skate.ogv', 'skate.webm'],   camLoad);

// }

// function videoSwitchBack(){

//   cam = createVideo(['cheney.mp4', 'cheney.ogv', 'cheney.webm'],   camLoad);

// }

// function videoSwitchThreshold(){

//   if (vol2>17){
//   videoSwitch();
//  }
// }
