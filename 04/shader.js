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
let textureImage
let spring = 0.005;
let gravity = 0.1;
let friction = -0.9;
let stretch;

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

    textureImage = loadImage('../input/garbage.jpg')
}

let balls = []

function setup() {
    // shaders require WEBGL mode to work
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    noStroke();
        emptyAudioFile = loadSound("../input/empty.mp3",loaded);
        audioSetup();
        fft.setInput(mic);
       

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            balls.push(new Ball(i*width/5, j*height/5, width/5));
        }
    }

    // for (let i = 0; i < 10; i++) {
    //     balls[i] = new Ball(
    //         random(width),
    //         random(height),
    //         10,
    //         i,
    //         balls,
    //         0,
    //     );
    // }
}

let inc = 0

function draw() {
    audioDraw();
    detectBeat(micVolume);
    background(0);
    copy(
        textureImage,
        map(micVolume, 0, 1, 0, 100),
        0,
        1,
        1,
        -width / 2,
        -height / 2,
        width,
        height
    );
    // shader() sets the active shader with our shader
    shader(myShader);
    

    // Send the frameCount to the shader
    myShader.setUniform("uFrameCount", frameCount);
    myShader.setUniform("u_resolution", [width, height]);
    myShader.setUniform("u_mouse", [mouseX, mouseY]);
    myShader.setUniform("u_texture", textureImage);

    // Rotate our geometry on the X and Y axes
    // translate(0,70);


    // rotateX(inc%360);

    // inc += 0.01;
    // rotateY(100);

    for (let i = 0; i < balls.length; i++) {
        // balls[i].move()
        balls[i].grow(stretch);
        balls[i].show();
        
    }

    //stepped mapping
    stretch = ceil(map(micVolume, 0, 0.5, 0, 20))*40;

    //normal volume mapping
    //stretch = map(micVolume, 0, 0.5, 80, 500);

    // for (let i = 0; i < balls.length; i++) {
    //     balls[i].collide();
    //     balls[i].move();
    //     balls[i].display();
    // }

    // Draw some geometry to the screen
    // We're going to tessellate the sphere a bit so we have some more geometry to work with
    // push();
    // translate(
    //     map(mouseX, 0, width, -width / 2, width / 2),
    //     map(mouseY, 0, height, -height / 2, height / 2),
    // );
    // sphere(width / 10, 200, 200);
    // pop();
    manualFrameCount += 0.001;
}

class Ball{


    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
        let angle = random(0, 2 * PI);
         this.xspeed = random(2, 5) * Math.cos(angle);
         this.yspeed = random(2, 5) * Math.sin(angle);
    }

    grow(ballSize){
        this.r=ballSize;
    }


    move(){
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.x > width - this.r || this.x < 0+this.r) this.xspeed *= -1;
        if (this.y > height -this.r || this.y < 0+this.r) this.yspeed *= -1;
    }

    show(){
        push();
        translate(
            map(this.x, 0, width, -width / 2, width / 2),
            map(this.y, 0, height, -height / 2, height / 2)
        );
        sphere(this.r, 200, 200);
        pop();
    }
}

// class Ball {
//     constructor(xin, yin, din, idin, oin, col) {
//         this.x = xin;
//         this.y = yin;
//         this.vx = 0;
//         this.vy = 0;
//         this.diameter = din;
//         this.id = idin;
//         this.others = oin;
//         this.col = col;
//     }

//     collide() {
//         for (let i = this.id + 1; i < balls.length; i++) {
//             // console.log(others[i]);
//             let dx = this.others[i].x - this.x;
//             let dy = this.others[i].y - this.y;
//             let distance = dist(
//                 this.x,
//                 this.y,
//                 this.others[i].x,
//                 this.others[i].y
//             );
//             let minDist = this.others[i].diameter / 2 + this.diameter / 2;
//             //   console.log(distance);
//             //console.log(minDist);
//             if (distance < minDist) {
//                 //console.log("2");
//                 let angle = atan2(dy, dx);
//                 let targetX = this.x + cos(angle) * minDist;
//                 let targetY = this.y + sin(angle) * minDist;
//                 let ax = (targetX - this.others[i].x) * spring;
//                 let ay = (targetY - this.others[i].y) * spring;
//                 this.vx -= ax;
//                 this.vy -= ay;
//                 this.others[i].vx += ax;
//                 this.others[i].vy += ay;
//             }
//         }
//     }

//     move() {
//         this.vy += gravity;
//         this.x += this.vx;
//         this.y += this.vy;
//         if (this.x + this.diameter / 2 > width) {
//             this.x = width - this.diameter / 2;
//             this.vx *= friction;
//         } else if (this.x - this.diameter / 2 < 0) {
//             this.x = this.diameter / 2;
//             this.vx *= friction;
//         }
//         if (this.y + this.diameter / 2 > height) {
//             this.y = height - this.diameter / 2;
//             this.vy *= friction;
//         } else if (this.y - this.diameter / 2 < 0) {
//             this.y = this.diameter / 2;
//             this.vy *= friction;
//         }
//     }

//     display() {
//         push();
//         translate(
//             map(this.x, 0, width, -width / 2, width / 2),
//             map(this.y, 0, height, -height / 2, height / 2)
//         );
//         sphere(this.diameter, 200, 200);
//         pop();
//     }

//     blow(blow) {
//         this.vy += blow;
//         this.vx += blow;
//     }
// }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
        // for (let i = 0; i < balls.length; i++) {
        //     balls[i].blow(random(-10, 10));
        // }
}
