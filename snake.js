const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const gridSize = 20; 
const snakeColor = "#00FF00";
const foodColor = "#FF0000";

let snake = [{ x: 5, y: 5 }];
let food = { x: 15, y: 15 };
let direction = "right";
let isGameOver = false;

canvas.width = 400; 
canvas.height = 400; 

let gameInterval; 
function drawSnake() {
    ctx.fillStyle = snakeColor;
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    if (isGameOver) return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    switch (direction) {
        case "up":
            headY--;
            break;
        case "down":
            headY++;
            break;
        case "left":
            headX--;
            break;
        case "right":
            headX++;
            break;
    }

    snake.unshift({ x: headX, y: headY });

    if (headX === food.x && headY === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
        }
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize
    ) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            break;
        }
    }
}

function checkWin() {
    if (snake.length === (canvas.width / gridSize) * (canvas.height / gridSize)) {
        isGameOver = true;
        clearInterval(gameInterval);

        const modal = document.getElementById("game-over-modal");
        modal.style.display = "block";
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `
            <h2>Bravo, vous avez gagné!</h2>
            <p>Votre score : <span id="score">${snake.length}</span></p>
            <button id="restart-button">Rejouer</button>
        `;

        document.getElementById("restart-button").addEventListener("click", () => {
            restartGame();
        });
    }
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);

    const modal = document.getElementById("game-over-modal");
    modal.style.display = "block";

    const score = document.getElementById("score");
    score.textContent = snake.length;
}

function restartGame() {
    isGameOver = false;
    snake = [{ x: 5, y: 5 }];
    food = { x: 15, y: 15 };
    direction = "right";
    const modal = document.getElementById("game-over-modal");
    modal.style.display = "none";
    gameInterval = setInterval(gameLoop, 100); 
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    checkWin(); 
    drawSnake();
    drawFood();
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

document.getElementById("start-button").addEventListener("click", () => {
    if (isGameOver) {
        restartGame();
    } else {
        gameInterval = setInterval(gameLoop, 100); 
    }
});

document.getElementById("restart-button").addEventListener("click", () => {
    restartGame();
});