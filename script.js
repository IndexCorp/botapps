const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("scoreDisplay");
const scoreElement = document.getElementById("score");
const mobileWarning = document.getElementById("mobileWarning");

// Проверяем, является ли устройство мобильным
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (!isMobile) {
    mobileWarning.style.display = "block";
    startButton.style.display = "none";
} else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Переменные игры
let spaceship = { x: canvas.width / 2, y: canvas.height - 50, width: 40, height: 40 };
let bullets = [];
let meteors = [];
let score = 0;
let gameRunning = false;

// Функции для отрисовки
function drawSpaceship() {
    ctx.fillStyle = "white";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawMeteors() {
    ctx.fillStyle = "red";
    meteors.forEach((meteor, index) => {
        meteor.y += meteor.speed;
        if (meteor.y > canvas.height) meteors.splice(index, 1);
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        meteors.forEach((meteor, mIndex) => {
            const dist = Math.hypot(bullet.x - meteor.x, bullet.y - meteor.y);
            if (dist < meteor.radius) {
                bullets.splice(bIndex, 1);
                meteors.splice(mIndex, 1);
                score++;
                scoreElement.textContent = score;
            }
        });
    });
}

// Управление
function handleInput(event) {
    const touchX = event.touches[0].clientX;
    spaceship.x = touchX - spaceship.width / 2;
}

function shootBullet() {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y, width: 4, height: 10, speed: 5 });
}

function spawnMeteor() {
    const x = Math.random() * canvas.width;
    const radius = Math.random() * 20 + 10;
    const speed = Math.random() * 2 + 1;
    meteors.push({ x, y: -radius, radius, speed });
}

// Главный цикл игры
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpaceship();
    drawBullets();
    drawMeteors();
    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// Запуск игры
startButton.addEventListener("click", () => {
    if (!isMobile) return;

    gameRunning = true;
    startButton.style.display = "none";
    canvas.style.display = "block";
    scoreDisplay.style.display = "block";

    setInterval(spawnMeteor, 1000);
    gameLoop();
});

// Управление касанием
canvas.addEventListener("touchmove", handleInput);
canvas.addEventListener("touchstart", shootBullet);
