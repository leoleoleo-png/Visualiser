//Dynamically drawn sprites
//sprite with a custom drawing function follows the mouse
//and changes shape according to its speed

let direction = 90;
let GRAVITY = 0.2;
var imgChoice;
let timer = 0;
var shapes = 1;
function createMic() {
    mic = new p5.AudioIn();
    mic.start();
}

function preload() {
    imgChoice = "../input/flowers5.png";
    mainTexture = loadImage(imgChoice);
}

function getMicVolume() {
    micVolume = mic.getLevel();
}

function setup() {
    createCanvas(windowWidth, windowHeight);


  let limitLabel = createP("Sensitivity");
  limitLabel.parent(controller);

  slider = createSlider(0.5, 3.5, 2, 0.1);
  slider.parent(controller);

  limitLabel.position(10, 40);

    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    userStartAudio();

 

  

}

function draw() {
    //background(255);
    fill(0);
    getMicVolume();

    let mappy = map(micVolume*slider.value(), 0, 1, 0, 10);

    //the best way to organize sprites is to use a custom group (see Group class)
    //however, all sprites are automatically added to a default group allSprites
    //that you can access like a normal array of objects

    for (let i = 0; i < allSprites.length; i++) {
        let mySprite = allSprites[i];

        //adding a speed at 90 degrees (down)
        //equivalent to: mySprite.velocity.y += GRAVITY;
        mySprite.addSpeed(GRAVITY, 90);

        //even if they are out of the canvas, sprites keep getting updated
        //consuming precious memory
        //use Sprite.remove() to remove a sprite from the sketch

        if (mySprite.position.x > windowWidth) mySprite.remove();



        mySprite.setSpeed(3 * mappy, 3 * mappy);
    }


    direction += 2;

    //draw the sprites
    drawSprites();

    if (millis() >= 200 + timer) {
        if (mappy > 2) {
            imageLaunch();
            changeImg();

        }

        timer = millis();
    }







}



function imageLaunch() {

    let randoX = random(windowWidth / 2);
    let randoY = random(windowHeight );

    let newSprite = createSprite(randoX, randoY-100);

    //assign an animation
    newSprite.addAnimation(
        'normal',
        mainTexture,

    );

    //and set it to a random frame
    newSprite.animation.stop();



}



function changeImg() {
    if (imgChoice == "../input/flowers5.png") {
        imgChoice = "../input/flowers3.png";
        mainTexture = loadImage(imgChoice);
    } else if (imgChoice == "../input/flowers3.png") {
        imgChoice = "../input/flowers2.png";
        mainTexture = loadImage(imgChoice);
    } else if (imgChoice == "../input/flowers2.png") {
        imgChoice = "../input/flowers5.png";
        mainTexture = loadImage(imgChoice);
    }
}