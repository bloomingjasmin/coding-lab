// let cam;
// let poseNet
// let poses = [];
// let person;

// function setup() {
//     createCanvas(640, 480);
//     cam = createCapture(VIDEO);
//     cam.hide();

//     poseNet = ml5.poseNet(cam, modelLoaded);
//     // Listen to new 'pose' events
//     poseNet.on('pose', gotResults);
// }

// function draw() {
//     background(220);
//     image(cam, 0, 0);

//     if (person) {
//         //console.log(person.pose.leftEar);
//         let leftConfidence = person.pose.leftEar.confidence;
//         if (leftConfidence > 0.55) {
//             let x = person.pose.leftEar.x;
//             let y = person.pose.leftEar.y;
//             circle(x, y, 30);
//         }

//         let rightConfidence = person.pose.rightEar.confidence;
//         if (rightConfidence > 0.55) {
//             let x = person.pose.rightEar.x;
//             let y = person.pose.rightEar.y;
//             circle(x, y, 30);
//         }

//     }
// }

// function modelLoaded() {
//     console.log("Model (PoseNet) is Loaded!")
// }

// function gotResults(results) {
//     poses = results;
//     //console.log(poses);
//     if (poses.length > 0) {
//         person = poses[0];
//     }
// }