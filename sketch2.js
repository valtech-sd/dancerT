let canvas,
  video,
  poseNet,
  poses = [];

let drumLoopOne, drumLoopTwo;
let dubstepLoopOne, dubstepLoopTwo;
let guitarLoopTwo, guitarLoopOne;
let violinLoopOne, violinLoopTwo;

function preload() {
  drumLoopOne = loadSound('drumLoopOne.mp3');
  drumLoopTwo = loadSound('drumLoopTwo.mp3');

  dubstepLoopOne = loadSound('dubstepLoopOne.mp3');
  dubstepLoopTwo = loadSound('dubstepLoopTwo.mp3');

  guitarLoopOne = loadSound('guitarLoopOne.mp3');
  guitarLoopTwo = loadSound('guitarLoopTwo.mp3');

  violinLoopOne = loadSound('violinLoopOne.mp3');
  violinLoopTwo = loadSound('violinLoopTwo.mp3');
}

function setup() {
  canvas = createCanvas(800, 560);
  canvas.position((windowWidth - width) / 2, 100);

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
  push();
  translate(video.width, 0);
  scale(-1, 1);
  background(255, 240);
  pop();

  drawSkeleton();
  musicPlayer();
}

function drawSkeleton() {
  // console.log({ poses });
  for (let i = 0; i < poses.length; i++) {
    const pose = poses[i].pose;

    const nose = pose.keypoints[0];
    const leftEye = pose.keypoints[1];
    const rightEye = pose.keypoints[2];
    const leftEar = pose.keypoints[3];
    const rightEar = pose.keypoints[4];
    const leftShoulder = pose.keypoints[5];
    const rightShoulder = pose.keypoints[6];
    const leftElbow = pose.keypoints[7];
    const rightElbow = pose.keypoints[8];
    const leftWrist = pose.keypoints[9];
    const rightWrist = pose.keypoints[10];
    const leftHip = pose.keypoints[11];
    const rightHip = pose.keypoints[12];
    const leftKnee = pose.keypoints[13];
    const rightKnee = pose.keypoints[14];
    const leftAnkle = pose.keypoints[15];
    const rightAnkle = pose.keypoints[16];

    if (nose.score > 0.5) {
      strokeWeight(10);
      strokeCap(ROUND);
      stroke('#b48ead');
      fill('#88c0d0');

      // head
      const faceRadius = dist(width - nose.position.x, nose.position.y, width - leftEar.position.x, leftEar.position.y);
      ellipse(width - nose.position.x, nose.position.y, faceRadius, faceRadius + 60);

      // shoulders
      line(width - rightShoulder.position.x, rightShoulder.position.y, width - rightElbow.position.x, rightElbow.position.y);
      //line joining left shoulder to elbow
      line(width - leftShoulder.position.x, leftShoulder.position.y, width - leftElbow.position.x, leftElbow.position.y);

      // top arm
      line(width - rightElbow.position.x, rightElbow.position.y, width - rightWrist.position.x, rightWrist.position.y);
      line(width - leftElbow.position.x, leftElbow.position.y, width - leftWrist.position.x, leftWrist.position.y);

      // elbows
      ellipse(width - leftElbow.position.x, leftElbow.position.y, 30, 30);
      ellipse(width - rightElbow.position.x, rightElbow.position.y, 30, 30);

      // wrists
      ellipse(width - rightWrist.position.x, rightWrist.position.y, 30, 30);
      ellipse(width - leftWrist.position.x, leftWrist.position.y, 30, 30);

      // body
      quad(
        width - rightShoulder.position.x,
        rightShoulder.position.y,
        width - leftShoulder.position.x,
        leftShoulder.position.y,
        width - leftHip.position.x,
        leftHip.position.y,
        width - rightHip.position.x,
        rightHip.position.y
      );

      // hips
      ellipse(width - rightHip.position.x, rightHip.position.y, 30, 30);
      ellipse(width - leftHip.position.x, leftHip.position.y, 30, 30);

      // top legs
      line(width - rightHip.position.x, rightHip.position.y, width - rightKnee.position.x, rightKnee.position.y);
      line(width - leftHip.position.x, leftHip.position.y, width - leftKnee.position.x, leftKnee.position.y);

      // knees
      ellipse(width - rightKnee.position.x, rightKnee.position.y, 30, 30);
      ellipse(width - leftKnee.position.x, leftKnee.position.y, 30, 30);

      // bottom legs
      line(width - rightKnee.position.x, rightKnee.position.y, width - rightAnkle.position.x, rightAnkle.position.y);
      line(width - leftKnee.position.x, leftKnee.position.y, width - leftAnkle.position.x, leftAnkle.position.y);

      // ankles
      ellipse(width - leftAnkle.position.x, leftAnkle.position.y, 30, 30);
      ellipse(width - rightAnkle.position.x, rightAnkle.position.y, 30, 30);
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
