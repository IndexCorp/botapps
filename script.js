const tg = window.Telegram.WebApp;

// Инициализация Telegram Web App
tg.MainButton.setParams({
    text: "Начать игру",
    color: "#007BFF"
});

// Показать кнопку Telegram
tg.MainButton.show();

// Действие при нажатии на кнопку Telegram
tg.MainButton.onClick(() => {
    startGame();
});

// Установка размеров канваса
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreText = document.getElementById("scoreText");

// Загружаем изображения
const spaceshipImg = new Image();
spaceshipImg.src = "spaceship.png";

const meteorImg = new Image();
meteorImg.src = "meteor.png";

const scoreIcon = new Image();
scoreIcon.src = "score-icon.png";

// Космолет
const spaceship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speedX: 0
};

// Метеориты
const comets = [];
function createComet() {
    const x = Math.random() * canvas.width;
    comets.push({ x, y: 0, radius: 20, speed: 2 + Math.random() * 3 });
}

// Снаряды
const bullets = [];
function shootBullet() {
    bullets.push({ x: spaceship.x + spaceship.width / 2, y: spaceship.y, radius: 3, speed: 5 });
}

// Управление через движение устройства
function setupDeviceMotion() {
    window.addEventListener("deviceorientation", (event) => {
        const tiltX = event.gamma || 0;
        spaceship.speedX = tiltX / 10;
    });
}

// Фон - эффект падающих звезд
let stars = [];
function createStars() {
    const numberOfStars = 80;

    for (let i = 0; i < numberOfStars; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = Math.random() * 0.5 + 0.5;

        stars.push({ x, y, size, speed });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
}

// Счет
let score = 0;

// Основной игровой цикл
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновление фона
    updateStars();

    // Позиция космолета
    spaceship.x += spaceship.speedX;
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.x > canvas.width - spaceship.width) spaceship.x = canvas.width - spaceship.width;

    ctx.drawImage(spaceshipImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Отрисовка метеоритов
    for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        comet.y += comet.speed;
        if (comet.y > canvas.height) {
            comets.splice(i, 1);
        } else {
            ctx.drawImage(meteorImg, comet.x, comet.y, comet.radius * 2, comet.radius * 2);
        }
    }

    // Обновление снарядов
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(i, 1);
        } else {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();

            // Проверка столкновений с метеоритами
            for (let j = comets.length - 1; j >= 0; j--) {
                const comet = comets[j];
                const dx = bullet.x - comet.x;
                const dy = bullet.y - comet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < bullet.radius + comet.radius) {
                    bullets.splice(i, 1);
                    comets.splice(j, 1);
                    score++;
                    scoreText.textContent = score;
                    break;
                }
            }
        }
    }

    // Создание новых метеоритов
    if (Math.random() < 0.02) createComet();

    requestAnimationFrame(update);
}

function startGame() {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response === "granted") {
                    setupDeviceMotion();
                } else {
                    alert("Доступ к датчикам отклонён.");
                }
            })
            .catch(() => alert("Ваш браузер не поддерживает DeviceOrientation API."));
    } else {
        setupDeviceMotion(); 
    }

    tg.MainButton.hide(); // Скрыть кнопку после начала игры
    createStars();
    update();
}

canvas.addEventListener("touchstart", function(event) {
    event.preventDefault();
    shootBullet();
});

canvas.addEventListener("click", function(event) {
    shootBullet();
});
