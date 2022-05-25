let video;
let poseNet;
let poses = [];
let skeletons = [];

let drumLoopOne, drumLoopTwo;
let dubstepLoopOne, dubstepLoopTwo;
let guitarLoopTwo, guitarLoopOne;
let violinLoopOne, violinLoopTwo;

const colors = ['#bf616a', '#88c0d0', '#81a1c1', '#5e81ac', '#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#b48ead'];
const random = Math.floor(Math.random() * colors.length);
const randomColor = colors[random];

function preload() {
  drumLoopOne = loadSound('drumLoopOne.mp3');
  drumLoopTwo = loadSound('drumLoopTwo.mp3');

  dubstepLoopOne = loadSound('dubstepLoopOne.mp3');
  dubstepLoopTwo = loadSound('dubstepLoopTwo.mp3');

  guitarLoopOne = loadSound('guitarLoopOne.mp3');
  guitarLoopTwo = loadSound('guitarLoopTwo.mp3');

  violinLoopOne = loadSound('violinLoopOne.mp3');
  violinLoopTwo = loadSound('violinLoopTwo.mp3');

  // musicNoteImage = loadImage('note.png');
}

function setup() {
  createCanvas(800, 560);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });
}

function modelReady() {
  console.log('pose net ready');
  success = createP('Move around to play some music!');
  success.class('success');
}

function draw() {
  // flip the camera before we draw the video to the canvas
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  drawJoints();
  drawSkeleton();
  musicPlayer();
}

// A function to draw ellipses over the detected keypoints
function drawJoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    let nose = poses[i].pose.keypoints[0];

    if (nose.score > 0.7) {
      fill(255, 0, 0);
      noStroke();
      ellipse(nose.position.x, nose.position.y, 20, 20);
    }
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];

      // Only draw an ellipse is the pose probability is bigger than 0.2
      // if (keypoint.score > 0.7) {
      //   fill(255);
      //   noStroke();
      //   ellipse(keypoint.position.x, keypoint.position.y, 20, 20);
      // }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(randomColor);
      strokeWeight(20);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function musicPlayer() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    let nose = pose.keypoints[0];
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];

    if (nose.score > 0.5) {
      // nose
      if (nose.position.y > 0 && nose.position.y <= height / 3 && !drumLoopTwo.isPlaying()) {
        noStroke();
        fill(200, 150, 176, 100);
        rectMode(CENTER);
        rect(width / 2, 70, width, height / 3);
        drumLoopTwo.play();
        // drumLoopTwo.loop();
      } else if (nose.position.y > height / 3 && nose.position.y < height && drumLoopTwo.isPlaying()) {
        drumLoopTwo.stop();
      }

      // rightWrist
      if (rightWrist.score > 0.5) {
        if (width - rightWrist.position.x > width - 200 && rightWrist.position.x > 0 && !drumLoopOne.isPlaying()) {
          console.log('play drum');
          drumLoopOne.play();
          noStroke();
          fill(118, 248, 176, 100);
          rectMode(CENTER);
          rect(700, height / 2, width / 4, height);
        } else if (width - rightWrist.position.x < width - 200 && rightWrist.position.x < 800 && drumLoopOne.isPlaying()) {
          drumLoopOne.stop();
          console.log('stop drum');
        }
      }

      leftWrist;
      if (width - leftWrist.position.x < width - 600 && leftWrist.position.x < 800 && !guitarLoopOne.isPlaying()) {
        if (leftWrist.score > 0.5) {
          guitarLoopOne.play();
          noStroke();
          fill(200, 150, 176, 100);
          rectMode(CENTER);
          rect(100, 280, width / 4, height);
          console.log('play guitar');
        } else if (width - leftWrist.position.x > width - 600 && leftWrist.position.x > 0 && guitarLoopOne.isPlaying()) {
          guitarLoopOne.stop();
          console.log('stop guitar');
        }
      }
    }
  }
}
