const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const endScreen = document.getElementById("endScreen");
const gameUI = document.getElementById("gameUI");

let isPlaying = false;
const boxSize = 20;
const canvasSize = canvas.width;
const maxPosition = canvasSize / boxSize;
let snake = [];
let food = {};
let dx = 1;
let dy = 0;
let interval;
let score = 0;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  dx = 1;
  dy = 0;
  score = 0;
  updateScore();
  gameUI.style.display = "block";
  endScreen.style.display = "none";
}

function startGame() {
  if (!isPlaying) {
    resetGame();
    isPlaying = true;
    interval = setInterval(updateGame, 100);
  }
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * maxPosition),
    y: Math.floor(Math.random() * maxPosition),
  };
}

function endGame() {
  isPlaying = false;
  clearInterval(interval);
  document.getElementById("finalScore").textContent = score;
  endScreen.style.display = "block";
}

function restartGame() {
  endScreen.style.display = "none";
  startGame();
}

function updateScore() {
  scoreElement.textContent = "Wynik: " + score;
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.keyCode === 37 && dx === 0) {
    // Left arrow
    dx = -1;
    dy = 0;
  } else if (event.keyCode === 38 && dy === 0) {
    // Up arrow
    dx = 0;
    dy = -1;
  } else if (event.keyCode === 39 && dx === 0) {
    // Right arrow
    dx = 1;
    dy = 0;
  } else if (event.keyCode === 40 && dy === 0) {
    // Down arrow
    dx = 0;
    dy = 1;
  }
}

function updateGame() {
  if (!isPlaying) return;

  const head = Object.assign({}, snake[0]); // Copy current head
  head.x += dx;
  head.y += dy;

  // Check wall collisions
  if (
    head.x < 0 ||
    head.x >= maxPosition ||
    head.y < 0 ||
    head.y >= maxPosition
  ) {
    return endGame();
  }

  // Check body collisions
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return endGame();
    }
  }

  snake.unshift(head);

  // Check food collisions
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    food = generateFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  // Clear canvas
  context.clearRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  context.fillStyle = "green";
  for (let segment of snake) {
    context.fillRect(
      segment.x * boxSize,
      segment.y * boxSize,
      boxSize,
      boxSize
    );
  }

  // Draw food
  context.fillStyle = "blue";
  context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}
