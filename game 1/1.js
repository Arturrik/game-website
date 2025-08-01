document.addEventListener('DOMContentLoaded', function() {
   
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    
    const upBtn = document.querySelector('.up-btn');
    const downBtn = document.querySelector('.down-btn');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    
    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let score = 0;
    
    
    let snake = [
        {x: 10, y: 10}
    ];
    let velocityX = 0;
    let velocityY = 0;
    
    
    let foodX = 5;
    let foodY = 5;
    
   
    let gameRunning = false;
    let gamePaused = false;
    let gameLoop;
    
    
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    
  
    upBtn.addEventListener('touchstart', () => changeDirectionMobile('up'));
    downBtn.addEventListener('touchstart', () => changeDirectionMobile('down'));
    leftBtn.addEventListener('touchstart', () => changeDirectionMobile('left'));
    rightBtn.addEventListener('touchstart', () => changeDirectionMobile('right'));
    
    
    upBtn.addEventListener('mousedown', () => changeDirectionMobile('up'));
    downBtn.addEventListener('mousedown', () => changeDirectionMobile('down'));
    leftBtn.addEventListener('mousedown', () => changeDirectionMobile('left'));
    rightBtn.addEventListener('mousedown', () => changeDirectionMobile('right'));
    
   
    document.addEventListener('keydown', changeDirection);
    
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            
            if (dx > 0 && velocityX !== -1) {
                
                velocityX = 1;
                velocityY = 0;
            } else if (dx < 0 && velocityX !== 1) {
               
                velocityX = -1;
                velocityY = 0;
            }
        } else {
            
            if (dy > 0 && velocityY !== -1) {
                
                velocityX = 0;
                velocityY = 1;
            } else if (dy < 0 && velocityY !== 1) {
                
                velocityX = 0;
                velocityY = -1;
            }
        }
    }, false);
    
    
    function startGame() {
        if (gameRunning) {
            clearInterval(gameLoop);
        }
        
       
        snake = [{x: 10, y: 10}];
        velocityX = 0;
        velocityY = 0;
        score = 0;
        scoreDisplay.textContent = `Очки: ${score}`;
        gameRunning = true;
        gamePaused = false;
        startBtn.textContent = "Перезапуск";
        pauseBtn.textContent = "Пауза";
        
        generateFood();
        
        
        gameLoop = setInterval(drawGame, 100);
    }
    
    
    function togglePause() {
        if (!gameRunning) return;
        
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? "Продолжить" : "Пауза";
        
        if (gamePaused) {
            clearInterval(gameLoop);
        } else {
            gameLoop = setInterval(drawGame, 100);
        }
    }
    
    
    function changeDirection(e) {
        if (gamePaused || !gameRunning) return;
        
        
        if (e.key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
       
        if (e.key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        }
        
        if (e.key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
        
        if (e.key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
    
   
    function changeDirectionMobile(direction) {
        if (gamePaused || !gameRunning) return;
        
        
        if (navigator.vibrate) navigator.vibrate(50);
        
        switch(direction) {
            case 'up':
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case 'down':
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            case 'left':
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case 'right':
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
        }
    }
    
   
    function drawGame() {
        if (gamePaused) return;
        
    
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    
        const head = {x: snake[0].x + velocityX, y: snake[0].y + velocityY};
        snake.unshift(head);
        
      
        if (head.x === foodX && head.y === foodY) {
            score += 10;
            scoreDisplay.textContent = `Очки: ${score}`;
            generateFood();
        } else {
            snake.pop();
        }
        
        
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
            collision(head, snake.slice(1))) {
            clearInterval(gameLoop);
            gameRunning = false;
            alert(`Игра окончена! Ваш счёт: ${score}`);
            return;
        }
        
       
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
        
        
        ctx.fillStyle = "#2ecc71";
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        
        
        ctx.fillStyle = "#000";
        const eyeSize = gridSize / 5;
        
        
        let leftEyeX, leftEyeY;
        
        let rightEyeX, rightEyeY;
        
        if (velocityX === 1) {
            leftEyeX = head.x * gridSize + gridSize - eyeSize * 2;
            leftEyeY = head.y * gridSize + eyeSize * 2;
            rightEyeX = head.x * gridSize + gridSize - eyeSize * 2;
            rightEyeY = head.y * gridSize + gridSize - eyeSize * 3;
        } else if (velocityX === -1) { 
            leftEyeX = head.x * gridSize + eyeSize;
            leftEyeY = head.y * gridSize + eyeSize * 2;
            rightEyeX = head.x * gridSize + eyeSize;
            rightEyeY = head.y * gridSize + gridSize - eyeSize * 3;
        } else if (velocityY === 1) {
            leftEyeX = head.x * gridSize + eyeSize * 2;
            leftEyeY = head.y * gridSize + gridSize - eyeSize * 2;
            rightEyeX = head.x * gridSize + gridSize - eyeSize * 3;
            rightEyeY = head.y * gridSize + gridSize - eyeSize * 2;
        } else {
            leftEyeX = head.x * gridSize + eyeSize * 2;
            leftEyeY = head.y * gridSize + eyeSize;
            rightEyeX = head.x * gridSize + gridSize - eyeSize * 3;
            rightEyeY = head.y * gridSize + eyeSize;
        }
        
        ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
        ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
    }
    
    
    function generateFood() {
        let newFoodX, newFoodY;
        let foodOnSnake;
        
        do {
            newFoodX = Math.floor(Math.random() * tileCount);
            newFoodY = Math.floor(Math.random() * tileCount);
            foodOnSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
        } while (foodOnSnake);
        
        foodX = newFoodX;
        foodY = newFoodY;
    }
    
    
    function collision(head, array) {
        return array.some(segment => segment.x === head.x && segment.y === head.y);
    }
});