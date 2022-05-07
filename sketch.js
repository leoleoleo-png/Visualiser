function preload() {
    video = createVideo("crowd.mp4");
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);


    video.volume(0);
    video.hide();
    video.loadPixels();
    image(video, 0, 0);
    filter(THRESHOLD,0.2);
}

function mousePressed() {
      video.loop();
}
