document.addEventListener('DOMContentLoaded', () => {
    const scubaDiver = document.getElementById('scubaDiver');
    const scoreDisplay = document.getElementById('score');
    const summary = document.getElementById('summary');
    const summaryContent = document.getElementById('summaryContent');
    let diverTop = scubaDiver.offsetTop;
    let diverLeft = 400 - scubaDiver.offsetWidth - 20; 
    let score = 10;
    let isGameOver = false;

    const pointsTracker = {
        'clown-fish': 0,
        'nudibranch': 0,
        'starfish': 0,
        'shell': 0,
        'plastic': 0,
        'net': 0,
        'can': 0,
        'ship-wreck': 0,
        'shark': 0,
        'jelly-fish': 0,
        'eel': 0,
        'ammunition': 0
    };

    document.addEventListener('keydown', (e) => {
        moveDiver(e);
    });

    setInterval(() => {
        if (!isGameOver) {
            checkCollision();
        }
    }, 20);

    function moveDiver(e) {
        const step = 20; 
        switch (e.code) {
            case 'ArrowUp':
                if (diverTop > 0) diverTop -= step;
                break;
            case 'ArrowDown':
                if (diverTop < 600 - scubaDiver.offsetHeight) diverTop += step;
                break;
            case 'ArrowLeft':
                if (diverLeft > 0) diverLeft -= step;
                break;
            case 'ArrowRight':
                if (diverLeft < 400 - scubaDiver.offsetWidth) diverLeft += step;
                break;
        }
        scubaDiver.style.top = diverTop + 'px';
        scubaDiver.style.left = diverLeft + 'px';
    }

    function showPoints(points) {
        const pointsDisplay = document.createElement('div');
        pointsDisplay.classList.add('points-display');
        pointsDisplay.innerText = points > 0 ? `+${points}` : points;
        pointsDisplay.style.top = diverTop - 20 + 'px';
        pointsDisplay.style.left = diverLeft + 'px';
        document.querySelector('.game-container').appendChild(pointsDisplay);

        setTimeout(() => {
            pointsDisplay.remove();
        }, 1000);
    }

    function checkCollision() {
        const diverRect = scubaDiver.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle, .good-obstacle, .bad-obstacle, .rubbish');

        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();

            if (
                diverRect.left < obstacleRect.right &&
                diverRect.right > obstacleRect.left &&
                diverRect.top < obstacleRect.bottom &&
                diverRect.bottom > obstacleRect.top
            ) {
                let points = 0;
                let objectName = '';

                if (obstacle.classList.contains('good-obstacle')) {
                    points = 1;
                    objectName = obstacle.style.backgroundImage.split('/').pop().split('.')[0];
                } else if (obstacle.classList.contains('rubbish')) {
                    points = 2;
                    objectName = obstacle.style.backgroundImage.split('/').pop().split('.')[0];
                } else if (obstacle.classList.contains('bad-obstacle')) {
                    points = -1;
                    objectName = obstacle.style.backgroundImage.split('/').pop().split('.')[0];
                } else if (obstacle.classList.contains('ammunition')) {
                    isGameOver = true;
                    alert('Game Over! You hit the ammunition.');
                    showSummary();
                    return;
                }

                score += points;
                pointsTracker[objectName] += points;
                showPoints(points);
                obstacle.remove();
                scoreDisplay.innerHTML = 'Score: ' + score;

                if (score >= 25) {
                    alert('You win!');
                    showSummary();
                } else if (score <= -10) {
                    alert('Game Over!');
                    showSummary();
                }
            }
        });
    }

    function createObstacle() {
        const obstacleTypes = ['good-obstacle', 'bad-obstacle', 'rubbish', 'ammunition'];
        const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const obstacle = document.createElement('div');
        obstacle.classList.add(obstacleType);

        if (obstacleType === 'good-obstacle') {
            const goodObstacles = ['images/clown-fish.png', 'images/nudibranch.png', 'images/starfish.png', 'images/shell.png'];
            obstacle.style.backgroundImage = `url(${goodObstacles[Math.floor(Math.random() * goodObstacles.length)]})`;
        } else if (obstacleType === 'rubbish') {
            const rubbish = ['images/plastic.png', 'images/net.png', 'images/can.png'];
            obstacle.style.backgroundImage = `url(${rubbish[Math.floor(Math.random() * rubbish.length)]})`;
        } else if (obstacleType === 'bad-obstacle') {
            const badObstacles = ['images/ship-wreck.png', 'images/shark.png', 'images/jelly-fish.png', 'images/eel.png'];
            obstacle.style.backgroundImage = `url(${badObstacles[Math.floor(Math.random() * badObstacles.length)]})`;
        } else if (obstacleType === 'ammunition') {
            obstacle.style.backgroundImage = 'url(images/ammunition.png)';
        }

        obstacle.style.top = Math.random() * (600 - 50) + 'px';
        obstacle.style.right = '0px'; 
        obstacle.style.width = '50px'; 
        obstacle.style.height = '50px';
        obstacle.style.zIndex = '5'; 
        document.querySelector('.game-container').appendChild(obstacle);

        let obstacleRight = 400; 
        const obstacleSpeed = Math.random() * 2 + 2;
        const moveObstacle = setInterval(() => {
            if (isGameOver) {
                clearInterval(moveObstacle);
                return;
            }
            obstacleRight -= obstacleSpeed;
            obstacle.style.right = obstacleRight + 'px';
            if (obstacleRight < -50) {
                obstacle.remove();
                clearInterval(moveObstacle);
            }
        }, 20); 
    }

    function createObstaclesAsynchronously() {
        if (!isGameOver) {
            createObstacle();
            setTimeout(createObstaclesAsynchronously, Math.random() * 2000 + 1000);
        }
    }

    function resetGame() {
        score = 10;
        isGameOver = false;
        for (let key in pointsTracker) {
            pointsTracker[key] = 0;
        }

        diverTop = 0;
        diverLeft = 400 - scubaDiver.offsetWidth - 20;
        scubaDiver.style.top = diverTop + 'px';
        scubaDiver.style.left = diverLeft + 'px';

        const obstacles = document.querySelectorAll('.obstacle, .good-obstacle, .bad-obstacle, .rubbish, .ammunition');
        obstacles.forEach(obstacle => obstacle.remove());

        scoreDisplay.innerHTML = 'Score: ' + score;

        document.getElementById('gameContainer').style.display = 'block';
        summary.style.display = 'none';
        createObstaclesAsynchronously();
    }

    function startGame() {
        console.log('Game started');
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        createObstaclesAsynchronously(); 
    }

    function showSummary() {
        isGameOver = true;
        document.getElementById('gameContainer').style.display = 'none';
        summary.style.display = 'flex';
        summaryContent.innerHTML = '';

        let totalScore = 0;

        for (const [objectName, points] of Object.entries(pointsTracker)) {
            if (points !== 0) {
                const objectDiv = document.createElement('div');
                objectDiv.innerHTML = `
                    <img src="images/${objectName}.png" alt="${objectName}">
                    <span>${objectName.replace('-', ' ')}: ${points} points</span>
                `;
                summaryContent.appendChild(objectDiv);
                totalScore += points;
            }
        }

        const totalScoreDiv = document.createElement('div');
        totalScoreDiv.innerHTML = `<h3>Total Score: ${totalScore}</h3>`;
        summaryContent.appendChild(totalScoreDiv);
    }

    function restartGame() {
        window.location.reload();
    }

    function exitGame() {
        window.close();
    }

    window.startGame = startGame;
    window.restartGame = restartGame;
    window.exitGame = exitGame;
});
