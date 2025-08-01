document.addEventListener('DOMContentLoaded', function() {
  
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
   
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        createStars();
        createSpaceships();
        addAnimationStyles();
    }
    
    function createStars() {
        const starsCount = 100;
        
        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const size = Math.random() * 3;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.8 + 0.2;
            const animationDuration = Math.random() * 5 + 5;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.opacity = opacity;
            star.style.animation = `twinkle ${animationDuration}s infinite alternate`;
            
            heroSection.appendChild(star);
        }
    }
    
    function createSpaceships() {
        const shipsCount = 8;
        const shipTypes = ['spaceship-1', 'spaceship-2', 'spaceship-3'];
        
        for (let i = 0; i < shipsCount; i++) {
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
            
            heroSection.appendChild(ship);
        }
    }
    
    function addAnimationStyles() {
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
});