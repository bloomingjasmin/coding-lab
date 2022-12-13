function setup() {
    let canvas = createCanvas(400, 400);
    // canvas.parent("flowerCanvas")

}

function draw() {
    background(0);
    drawCreature(width / 2, height / 2);
    fill(255)
    textSize(15);
    text("Don't press on me, press on Start!", width / 4, height * 19 / 20);
}

function drawCreature(x, y) {
    push();
    translate(x, y);

    // petals
    push();
    for (let deg = 0; deg < 360; deg += 30) {
        let rD = 100;

        let angle0 = radians(deg + frameCount);
        let X0 = cos(angle0) * rD;
        let Y0 = sin(angle0) * rD;
        strokeWeight(7);
        stroke(0, 0, 0);
        fill(77, 238, 234);
        circle(X0, Y0, 50);

        let angle1 = radians(deg + 15 + frameCount);
        let X1 = cos(angle1) * rD;
        let Y1 = sin(angle1) * rD;

        let angle2 = radians(deg - 15 + frameCount);
        let X2 = cos(angle2) * rD;
        let Y2 = sin(angle2) * rD;

        noStroke();
        fill(77, 238, 234);
        triangle(0, 0, X1, Y1, X2, Y2);
    }
    pop();

    // body
    push();
    strokeWeight(5);
    stroke(0, 0, 0);
    circle(0, 0, 100);

    strokeWeight(3);

    let r = random(255);
    let g = random(255);
    let b = random(255);
    fill(r, g, b);

    if (mouseIsPressed === true) {
        fill(0, 0, 0);
        arc(0, 30, 50, 60, PI, TWO_PI, CHORD);
    } else {
        arc(0, 10, 50, 60, 0, PI, CHORD);
    }

    rotate(radians(20));
    ellipse(-25, -5, 7, 14);
    rotate(radians(-40));
    ellipse(25, -5, 7, 14);
    pop();

    pop();

    //endGif(450);
}
