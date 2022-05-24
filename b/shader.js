let theShader;

let mainTexture;
let distortTexture
var imgChoice;
let input;

function preload() {

    theShader = loadShader(
        "shader.vert",
        "shader.frag"
    );


    imgChoice = "../input/flowers.jpg";

    mainTexture = loadImage(imgChoice);
    distortTexture = loadImage("../input/displace3.jpg");
}



function setup() {
    // shaders require WEBGL mode to work
    audioSetup()


    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();


    let limitLabel = createP("Add your own image");
    limitLabel.parent(controller);
    limitLabel.position(5, 42);

    input = createFileInput(handleFile);
    input.parent(controller);
    input.size(180, 30);
    let col = color(255, 255, 255, 0);
    input.style('backgroundColor', col);
    shaderTexture = createGraphics(2, 2000, WEBGL);
    shaderTexture.noStroke();
}

function draw() {
    audioDraw();
    background(0);
    shaderTexture.shader(theShader);

    // shader() sets the active shader with our shader
    shader(theShader);

    theShader.setUniform("u_resolution", [width, height]);

    // lets just send the cam to our shader as a uniform
    theShader.setUniform("u_mainTexture", mainTexture);

    theShader.setUniform("u_distortTexture", distortTexture);

    theShader.setUniform("u_amt", map(micVolume, 0.0, 0.8, 0, 1));

    theShader.setUniform("u_resolution", [width, height]);

    shaderTexture.rect(0, 0, width, height);



    texture(shaderTexture);

    translate(-width / 2, -height / 2);


    // rect gives us some geometry on the screen

    rect(0, 0, width*(map(micVolume,0,0.6,1,3)), height * 1.2*(map(micVolume,0,0.6,1,3)));





    // copy(shaderTexture, width/2,500,30,500,0,0,width,200);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}




function handleFile(file) {

    if (file.type === 'image') {

        mainTexture = loadImage(file.data, '');
    } else {

    }
}