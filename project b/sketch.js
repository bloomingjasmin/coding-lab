// poseNet
let cam;
let poseNet
let poses = [];
let person;

// other
let beadsNumber = 20;
let EarringRadius = 100;
let incAngle = 0;
let colorR = 200;
let colorG = 200;
let colorB = 200;

let colors = []; /// ***
let buttons = [];
let beads = [];
let radx = 10;

let clipX = 0;
let clipY = 0;

let sample;
let interface = true;

function setup() {
  let canvas = createCanvas(800, 600);  // 4 x 3
  canvas.parent("p5Canvas")
  background(0);

  // capture
  cam = createCapture(VIDEO);
  cam.hide();

  // poseNet
  poseNet = ml5.poseNet(cam, modelLoaded);
  // Listen to new 'pose' events
  poseNet.on('pose', gotResults);

  // 
  weightSize = 4;

  clipRad = EarringRadius + 50;
  clipX = clipRad * cos(-PI / 2) + width / 2;
  clipY = clipRad * sin(-PI / 2) + height / 2;

  // JS Object
  let colors = [
    { r: 255, g: 72, b: 196 },
    { r: 43, g: 209, b: 252 },
    { r: 243, g: 234, b: 95 },
    { r: 207, g: 255, b: 235 },
    { r: 198, g: 184, b: 230 },
    { r: 251, g: 144, b: 144 },
    { r: 255, g: 187, b: 130 },
    { r: 174, g: 242, b: 121 },
    { r: 162, g: 255, b: 253 },
    { r: 182, g: 125, b: 255 },
  ];
  //console.log(colors[0].r);

  //create the buttons
  let size = 50;
  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let x = 100 + i * 60;
    let y = 50;
    buttons.push(new RectButton(x, y, size, size, c.r, c.g, c.b));
  }
  sample = new SampleBead();
}

function draw() {
  background(0);

  if (interface) {
    drawInterface();
  } else {
    drawTryItOn();
  }
}

function drawInterface() {
  ///Sample////
  sample.update();
  sample.display();

  ///// BUTTONS /////
  for (let i = 0; i < buttons.length; i++) {
    let btn = buttons[i];
    btn.checkMouse();
    btn.display();
  }

  drawEaring(clipX, clipY, 1.0);
}
function drawEaring(x, y, scl) {
  push();
  translate(x, y);
  scale(scl);
  translate(-clipX, -clipY);
  ////CLIP/////
  push();
  if (beads.length > 0) {
    stroke(255);
    strokeWeight(1);
    line(clipX, clipY, beads[0].x, beads[0].y);
  }
  rectMode(CENTER);
  fill(255);
  square(clipX, clipY, 10);
  pop();

  ///// BEADS /////
  // connnect lines
  for (let i = 0; i < beads.length - 1; i++) {
    let b = beads[i];
    let nextB = beads[i + 1];
    // line color
    stroke(250, 255, 250);
    strokeWeight(2);
    line(b.x, b.y, nextB.x, nextB.y);
  }

  for (let i = 0; i < beads.length; i++) {
    let b = beads[i];
    b.checkMouse();
    b.display();
  }
  pop();
}

function drawTryItOn() {
  image(cam, 0, 0, width, height);

  if (person) {
    //console.log(person.pose.leftEar);
    let leftConfidence = person.pose.leftEar.confidence;
    if (leftConfidence > 0.55) {
      let x = map(person.pose.leftEar.x, 640, 480, 800, 600);
      let y = map(person.pose.leftEar.y, 640, 480, 800, 600);
      drawEaring(x, y, 0.4);
    }

    let rightConfidence = person.pose.rightEar.confidence;
    if (rightConfidence > 0.55) {
      let x = map(person.pose.rightEar.x, 640, 480, 800, 600);
      let y = map(person.pose.rightEar.y, 640, 480, 800, 600);
      drawEaring(x, y, 0.4);
    }

  }
}


function keyPressed() {
  if (key == "w" || key == "W") {
    larger();
  }
  if (key == "s" || key == "S") {
    smaller();
  }

  if (keyCode == ENTER) {
    addBead();
  }

  if (key == "r") {
    resetBeads();
  }
}

function mousePressed() {
  for (let i = 0; i < beads.length; i++) {
    let b = beads[i];
    if (b.pressed() == true) {
      // if one bead is selected
      break; // finish the for loop
    }
  }
}

function mouseDragged() {
  for (let b of beads) {
    b.dragged();
  }
}

function mouseReleased() {
  for (let i = 0; i < beads.length; i++) {
    let b = beads[i];
    b.active = false;
  }
}

class RectButton {
  constructor(x, y, w, h, r, g, b) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.wOrigin = w;
    this.hOrigin = h;
    //
    this.r = r;
    this.g = g;
    this.b = b;
  }
  checkMouse() {
    if (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      // in
      this.w = this.wOrigin * 1.1;
      this.h = this.hOrigin * 1.1;
      if (mouseIsPressed) {
        this.w = this.wOrigin * 0.95;
        this.h = this.hOrigin * 0.95;

        colorR = this.r;
        colorG = this.g;
        colorB = this.b;
      }
    } else {
      // out
      this.w = this.wOrigin;
      this.h = this.hOrigin;
    }
  }
  display() {
    push();
    noStroke();
    fill(this.r, this.g, this.b);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}

class CircleButton {
  constructor(x, y, rad, r, g, b) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.radOrigin = radx; // ***
    //
    this.r = r;
    this.g = g;
    this.b = b;
    //
    this.active = false;
  }
  pressed() {
    let distance = dist(this.x, this.y, mouseX, mouseY);
    if (distance < this.rad * 2) {
      this.active = true;
      return true;
    } else {
      return false;
    }
  }
  dragged() {
    if (this.active) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
  checkMouse() {
    let distance = dist(this.x, this.y, mouseX, mouseY);
    if (distance < this.rad * 2) {
      // in
      this.rad = this.radOrigin * 1.1;
      if (mouseIsPressed) {
        this.rad = this.radOrigin * 0.95;
      }
    } else {
      // out
      this.rad = this.radOrigin;
      this.active = false;
    }
  }
  display() {
    push();
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.rad * 2);
    if (this.active) {
      noFill();
      stroke(255);
      circle(this.x, this.y, this.rad * 2 + 8);
    }
    pop();
  }
}

class SampleBead {
  constructor() {
    this.x = (width * 9) / 10;
    this.y = (height * 1) / 12.5;
    this.size = 2 * radx;
    this.r = colorR;
    this.g = colorG;
    this.b = colorB;
  }
  update() {
    this.size = 2 * radx;
    this.r = colorR;
    this.g = colorG;
    this.b = colorB;
  }
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.size);
  }
}

// functions for buttons
function addBead() {
  let x = EarringRadius * cos(incAngle - PI / 2) + width / 2;
  let y = EarringRadius * sin(incAngle - PI / 2) + height / 2;
  incAngle = incAngle + TWO_PI / beadsNumber;

  console.log(radx);
  beads.push(new CircleButton(x, y, radx, colorR, colorG, colorB));
}
function resetBeads() {
  beads = [];
  incAngle = 0;
}
function larger() {
  radx += 1;
}
function smaller() {
  radx -= 1;
}
function showTryItOn() {
  interface = false;
}
function showInterface() {
  interface = true;
}

// Functions for PoseNet
function modelLoaded() {
  console.log("Model (PoseNet) is Loaded!")
}
function gotResults(results) {
  poses = results;
  //console.log(poses);
  if (poses.length > 0) {
    person = poses[0];
  }
}