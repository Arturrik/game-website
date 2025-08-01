const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const speedElement = document.getElementById('speed');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');
const backgroundElements = document.getElementById('background-elements');


function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth * (700/550);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);


let score = 0;
let speed = 0;
let gameRunning = false;
let animationId;
let obstacles = [];
let stars = [];
const maxObstacles = 3; 


const ship = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 100,
    width: 30,
    height: 50,
    speed: 5
};


const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

let leftPressed = false;
let rightPressed = false;


function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 3 + 1
        });
    }
}


function drawStars() {
    ctx.fillStyle = '#fff';
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed + speed/10;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}


function drawShip() {
    ctx.fillStyle = '#3366ff';
    ctx.beginPath();
    ctx.moveTo(ship.x + ship.width/2, ship.y);
    ctx.lineTo(ship.x + ship.width, ship.y + ship.height);
    ctx.lineTo(ship.x, ship.y + ship.height);
    ctx.closePath();
    ctx.fill();
    
    
    ctx.fillStyle = '#66a3ff';
    ctx.beginPath();
    ctx.arc(ship.x + ship.width/2, ship.y + 15, 8, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.moveTo(ship.x + 5, ship.y + ship.height - 5);
    ctx.lineTo(ship.x + ship.width - 5, ship.y + ship.height - 5);
    ctx.lineTo(ship.x + ship.width/2, ship.y + ship.height + 10);
    ctx.closePath();
    ctx.fill();
}


function createObstacle() {
    if (obstacles.length >= maxObstacles) return;
    
    const size = Math.random() * 30 + 20;
    obstacles.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * 2 + 1 + speed/5
    });
}


function drawObstacles() {
    ctx.fillStyle = '#888';
    obstacles.forEach(obstacle => {
        
        ctx.beginPath();
        ctx.arc(
            obstacle.x + obstacle.width/2,
            obstacle.y + obstacle.height/2,
            obstacle.width/2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(
            obstacle.x + obstacle.width/3,
            obstacle.y + obstacle.height/3,
            obstacle.width/6,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(
            obstacle.x + obstacle.width/1.5,
            obstacle.y + obstacle.height/1.5,
            obstacle.width/8,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#888';
    });
}


function updateObstacles() {
    for (let i = obstacles.length-1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;
        
       
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreElement.textContent = score;
            continue;
        }
        
        
        if (
            ship.x + ship.width > obstacles[i].x &&
            ship.x < obstacles[i].x + obstacles[i].width &&
            ship.y + ship.height > obstacles[i].y &&
            ship.y < obstacles[i].y + obstacles[i].height
        ) {
            endGame();
            return;
        }
    }
}


function updateShip() {
    if ((keys.ArrowLeft || leftPressed) && ship.x > 0) {
        ship.x -= ship.speed;
    }
    if ((keys.ArrowRight || rightPressed) && ship.x < canvas.width - ship.width) {
        ship.x += ship.speed;
    }
}


function createBackgroundElements() {
  
    backgroundElements.innerHTML = '';

    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 5 + 5}s infinite alternate`;
        
        backgroundElements.appendChild(star);
    }

    
    const shipTypes = ['spaceship-1', 'spaceship-2', 'spaceship-3'];
    for (let i = 0; i < 8; i++) {
        const ship = document.createElement('div');
        const shipType = shipTypes[Math.floor(Math.random() * shipTypes.length)];
        ship.classList.add('spaceship', shipType);
        
        const startPosX = Math.random() > 0.5 ? -50 : window.innerWidth + 50;
        const startPosY = Math.random() * window.innerHeight;
        const endPosX = startPosX > 0 ? -50 : window.innerWidth + 50;
        const endPosY = Math.random() * window.innerHeight;
        const size = Math.random() * 30 + 20;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 15;
        
        ship.style.width = `${size}px`;
        ship.style.height = `${size}px`;
        ship.style.left = `${startPosX}px`;
        ship.style.top = `${startPosY}px`;
        ship.style.animation = `fly ${duration}s linear ${delay}s infinite`;
        ship.style.setProperty('--end-pos-x', `${endPosX}px`);
        ship.style.setProperty('--end-pos-y', `${endPosY}px`);
        
        backgroundElements.appendChild(ship);
    }

    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fly {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.8;
            }
            90% {
                opacity: 0.8;
            }
            100% {
                transform: translate(var(--end-pos-x), var(--end-pos-y)) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes twinkle {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}


function startGame() {
    score = 0;
    speed = 0;
    obstacles = [];
    gameRunning = true;
    
    scoreElement.textContent = score;
    speedElement.textContent = speed.toFixed(0);
    
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    initStars();
    createBackgroundElements();
    gameLoop();
}


function endGame() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'flex';
    cancelAnimationFrame(animationId);
}


function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    speed += 0.02;
    speedElement.textContent = speed.toFixed(0);
    
    
    if (obstacles.length < maxObstacles && Math.random() < 0.01) {
        createObstacle();
    }
    

    drawStars();
    updateShip();
    updateObstacles();
    drawObstacles();
    drawShip();
    
    animationId = requestAnimationFrame(gameLoop);
}


document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
    if (e.key === ' ' && !gameRunning) startGame();
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});


leftBtn.addEventListener('touchstart', () => leftPressed = true);
leftBtn.addEventListener('touchend', () => leftPressed = false);
leftBtn.addEventListener('mousedown', () => leftPressed = true);
leftBtn.addEventListener('mouseup', () => leftPressed = false);
leftBtn.addEventListener('mouseleave', () => leftPressed = false);

rightBtn.addEventListener('touchstart', () => rightPressed = true);
rightBtn.addEventListener('touchend', () => rightPressed = false);
rightBtn.addEventListener('mousedown', () => rightPressed = true);
rightBtn.addEventListener('mouseup', () => rightPressed = false);
rightBtn.addEventListener('mouseleave', () => rightPressed = false);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);


resizeCanvas();
initStars();
createBackgroundElements();