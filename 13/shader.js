//Dynamically drawn sprites
//sprite with a custom drawing function follows the mouse
//and changes shape according to its speed

let direction = 90;
let GRAVITY = 0.2;
var imgChoice;
let timer = 0;

function createMic() {
    mic = new p5.AudioIn();
    mic.start();

}

function preload() {
   

    imgChoice = "../input/flowers3.png";

    mainTexture = loadImage(imgChoice);

}

function getMicVolume() {
    micVolume = mic.getLevel();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    userStartAudio();

    let limitLabel = createP("Add your own image");
    limitLabel.parent(controller);
    limitLabel.position(5, 42);

    input = createFileInput(handleFile);
    input.parent(controller);
    input.size(180, 30);
    let col = color(255, 255, 255, 0);
    input.style('backgroundColor', col);

}

function draw() {
    //background(255);
    fill(0);
    getMicVolume();
    
    let mappy = map(micVolume, 0, 1, 0, 10);

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
        if (mySprite.position.y > height + 100) mySprite.remove();




        mySprite.setSpeed(3 * mappy, direction * mappy);
    }


    direction += 2;

    //draw the sprites
    drawSprites();

    if (millis() >= 500 + timer) {
        if (mappy > 4) {
            imageLaunch();
        }

        timer = millis();
    }



}



function imageLaunch() {

    let randoX = random(windowWidth);
    let randoY = random(windowHeight);

    let newSprite = createSprite(randoX, randoY);

    //assign an animation
    newSprite.addAnimation(
        'normal',
        mainTexture,
     
    );

    //and set it to a random frame
    newSprite.animation.stop();
   


}


function handleFile(file) {

    if (file.type === 'image') {

        mainTexture = loadImage(file.data, '');
 
    } else {

    }
}