
let ghost;
let score = 0;
let state = 'start';

// Player physics
let velocityY = 0;
let gravity = 0.45;
let jumpStrength = 7;
let playerSize = 40;
let playerX = 100;

// Pipes
let pipes = [];
let pipeWidth = 60;
let gapSize = 125;
let pipeSpeed = 2.5;
let spawnEvery = 100;

let groundY = 340;

function setup() {
  createCanvas(480, 360);
  spawnGhost();
}

function draw() {
  background(15, 10, 25);

  // Start screen
  if (state === 'start') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(22);
    text('Ghost Flappy\nPress SPACE to start',
         width / 2, height / 2);
    return;
  }

  // Game-over screen
  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(22);
    text('Game Over\nScore: ' + score +
         '\nPress SPACE to retry',
         width / 2, height / 2);
    return;
  }

  // Apply gravity and move ghost
  velocityY += gravity;
  ghost.y += velocityY;

  // Ground collision
  if (ghost.y + playerSize / 2 >= groundY) {
    ghost.y = groundY - playerSize / 2;
    state = 'over';
    return;
  }

  // Ceiling collision
  if (ghost.y - playerSize / 2 <= 0) {
    ghost.y = playerSize / 2;
    velocityY = 0;
  }

  // Spawn new pipes
  if (frameCount % spawnEvery === 0) {
    spawnPipe();
  }

  // Move pipes and check collisions
  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];

    p.x -= pipeSpeed;

    // Has the ghost passed this pipe?
    if (!p.passed && p.x + pipeWidth < playerX) {
      p.passed = true;
      score++;
    }

    // Check collision with pipe columns
    let overlapsX =
      playerX + playerSize / 2 > p.x &&
      playerX - playerSize / 2 < p.x + pipeWidth;

    let hitsPipe =
      ghost.y - playerSize / 2 < p.topHeight ||
      ghost.y + playerSize / 2 > p.bottomY;

    if (overlapsX && hitsPipe) {
      state = 'over';
      return;
    }

    // Remove pipes after they leave the screen
    if (p.x + pipeWidth < 0) {
      pipes.splice(i, 1);
    }
  }

  // Draw pipes
  for (let p of pipes) {
    drawPipe(p.x, p.topHeight, p.bottomY);
  }

  // Draw ground
  noStroke();
  fill(35, 30, 50);
  rect(0, groundY, width, height - groundY);

  // Draw original ghost
  drawGhost(ghost.x, ghost.y);

  // Display score
  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text('Score: ' + score, 12, 10);
}

function keyPressed() {
  if (key === ' ') {
    if (state === 'start' || state === 'over') {
      state = 'play';
      score = 0;
      pipes = [];
      spawnGhost();
    }

    if (state === 'play') {
      velocityY = -jumpStrength;
    }

    return false;
  }
}

function mousePressed() {
  if (state === 'start' || state === 'over') {
    state = 'play';
    score = 0;
    pipes = [];
    spawnGhost();
  }

  if (state === 'play') {
    velocityY = -jumpStrength;
  }
}

function spawnGhost() {
  ghost = {
    x: playerX,
    y: 160
  };
  velocityY = 0;
}

function spawnPipe() {
  let topHeight = random(40, 155);

  pipes.push({
    x: width,
    topHeight: topHeight,
    bottomY: topHeight + gapSize,
    passed: false
  });
}

function drawPipe(x, topHeight, bottomY) {
  noStroke();
  fill(0, 200, 100);

  // Upper pipe
  rect(x, 0, pipeWidth, topHeight);
  rect(x - 5, topHeight - 12, pipeWidth + 10, 12);

  // Lower pipe
  rect(x, bottomY, pipeWidth, groundY - bottomY);
  rect(x - 5, bottomY, pipeWidth + 10, 12);
}

function drawGhost(x, y) {
  noStroke();

  // Original ghost body
  fill(220, 255, 230);
  ellipse(x, y, 60, 60);

  // Original facial features
  fill(20);
  ellipse(x - 12, y - 5, 10);
  ellipse(x + 12, y - 5, 10);
  ellipse(x, y + 7, 6);
  ellipse(x, y + 19, 20, 6);
}
