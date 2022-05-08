


function Vehicle(x, y) {

  
    this.pos = createVector( x, y  );
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 8;
    this.maxspeed = 4;
    this.maxforce = 0.1;
  }
  
  Vehicle.prototype.behaviors = function () {
    var arrive = this.arrive(this.target);
  //print(ellipse.position());
    var mouse = createVector(mouseX, mouseY);
    
    var flee = this.flee(mouse);
     
    arrive.mult(1);
    flee.mult(5);
    this.applyForce(arrive);
    this.applyForce(flee);
  
  }
  
  Vehicle.prototype.applyForce = function (f) {
    this.acc.add(f);
  };
  
  Vehicle.prototype.update = function () {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  };
  
  Vehicle.prototype.show = function () {
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    strokeWeight(2);
    point(20+this.pos.x, 30+this.pos.y);
  };
  
  Vehicle.prototype.arrive = function (target) {
    var desired = p5.Vector.sub(target, this.pos);
  
    var d = desired.mag();
  var speed = this.maxspeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxspeed);
    } 
  
    desired.setMag(speed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  };
  
  Vehicle.prototype.flee = function (target) {
    
    var desired = p5.Vector.sub(target, this.pos);
    var d =desired.mag();
    if (d< 50){
      
    
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    
    return steer;
  } else{
    
    return createVector(0,0);
  }
  }



  function createMic() {
    //create new p5 audioIn object
    //remember to put this function in set up
    mic = new p5.AudioIn();
    mic.start();
}

function getMicVolume() {
    //stores mic levels in variable micVolume
    //values range from 0 to 1
    micVolume = mic.getLevel();
}


function createAmplitude() {
  // creates p5 amplitude constructor
  // remember to call this function in setup
  amplitude = new p5.Amplitude();
}

function getAmplitudeLevel() {
  // remember to delare global variable: let level;
  // stores amplitude values in variable level
  // values range from 0 to 1 but realistically from 0 to 0.6~
  level = amplitude.getLevel();
}