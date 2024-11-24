function filterGames() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const gameCards = document.querySelectorAll('.game-card p');

    gameCards.forEach(card => {
        const gameName = card.textContent.toLowerCase();
        if (gameName.includes(query)) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}
// Open the game
function openGame(gameTitle) {
    document.getElementById('modalTitle').textContent = gameTitle;
    const gameContainer = document.getElementById('gameContainer');

    if (gameTitle === 'Snake') {
        gameContainer.innerHTML = `
            <canvas id="snakeGame" width="400" height="400" style="background-color: black;"></canvas>
        `;
        startSnakeGame();
    } else if (gameTitle === 'Tebak Angka') {
        gameContainer.innerHTML = `
            <input type="number" id="guessInput" placeholder="Masukkan tebakan Anda">
            <button onclick="checkGuess()">Tebak</button>
            <p id="gameMessage"></p>
            <button onclick="startNewGuessGame()">Mulai Ulang</button>
        `;
        startNewGuessGame();
    } else if (gameTitle === 'Flappy Square') {
        gameContainer.innerHTML = `
            <canvas id="flappyGame" width="400" height="400" style="background-color: lightblue;"></canvas>
        `;
        startFlappyGame();
    }

    document.getElementById('gameModal').style.display = 'flex';
}

// Close the modal
function closeModal() {
    document.getElementById('gameModal').style.display = 'none';
}

// Snake Game
function startSnakeGame() {
    const canvas = document.getElementById('snakeGame');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let snake = [{ x: grid * 5, y: grid * 5 }];
    let food = { x: grid * 10, y: grid * 10 };
    let dx = grid;
    let dy = 0;
    let score = 0;

    // Load images for snake head, body, and food
    const headImg = new Image();
    headImg.src = 'images/head_snake.jpg'; // Path to head image
    const bodyImg = new Image();
    bodyImg.src = 'images/body_snake.png'; // Path to body image
    const foodImg = new Image();
    foodImg.src = 'images/food_snake.jpg'; // Path to food image

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw food
        if (foodImg.complete) {
            ctx.drawImage(foodImg, food.x, food.y, grid, grid);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, grid, grid);
        }

        // Draw snake
        snake.forEach((part, index) => {
            if (index === 0) {
                // Draw head
                if (headImg.complete) {
                    ctx.drawImage(headImg, part.x, part.y, grid, grid);
                } else {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(part.x, part.y, grid, grid);
                }
            } else {
                // Draw body
                if (bodyImg.complete) {
                    ctx.drawImage(bodyImg, part.x, part.y, grid, grid);
                } else {
                    ctx.fillStyle = 'lightgreen';
                    ctx.fillRect(part.x, part.y, grid, grid);
                }
            }
        });

        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check collision with food
        if (head.x === food.x && head.y === food.y) {
            // Generate new food position
            food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
            food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
            score++; // Increase score
        } else {
            // Remove the tail if food is not eaten
            snake.pop();
        }

        // Check collision with walls
        if (
            head.x < 0 || head.y < 0 ||
            head.x >= canvas.width || head.y >= canvas.height
        ) {
            alert('Game Over! Your Score: ' + score);
            resetGame();
        }

        // Check collision with itself
        if (snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
            alert('Game Over! Your Score: ' + score);
            resetGame();
        }

        // Display score
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
    }

    function changeDirection(e) {
        if (e.key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -grid;
        } else if (e.key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = grid;
        } else if (e.key === 'ArrowLeft' && dx === 0) {
            dx = -grid;
            dy = 0;
        } else if (e.key === 'ArrowRight' && dx === 0) {
            dx = grid;
            dy = 0;
        }
    }

    function resetGame() {
        snake = [{ x: grid * 5, y: grid * 5 }];
        dx = grid;
        dy = 0;
        score = 0;
        food = { x: grid * 10, y: grid * 10 };
    }

    document.addEventListener('keydown', changeDirection);
    setInterval(draw, 100);
}

// Tebak Angka Game
function startNewGuessGame() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    window.checkGuess = function () {
        const guess = parseInt(document.getElementById('guessInput').value);
        attempts++;

        if (guess === randomNumber) {
            document.getElementById('gameMessage').textContent = `Selamat! Anda menebak angka ${randomNumber} dalam ${attempts} percobaan.`;
        } else if (guess < randomNumber) {
            document.getElementById('gameMessage').textContent = 'Tebakan terlalu rendah.';
        } else {
            document.getElementById('gameMessage').textContent = 'Tebakan terlalu tinggi.';
        }
    };
}

// Flappy Square Game
function startFlappyGame() {
    const canvas = document.getElementById('flappyGame');
    const ctx = canvas.getContext('2d');
    const birdImg = new Image();
    birdImg.src = 'images/bird.png'; // Path to bird image

    const treeImg = new Image(); // Load tree image
    treeImg.src = 'images/tree.png'; // Path to tree image

    let bird = { x: 50, y: 200, width: 40, height: 30, dy: 0 }; // Bird size and position
    const gravity = 0.5;
    const jump = -10;
    const pipes = [{ x: 400, y: 0, width: 50, height: 150 }]; // Adjusted pipe width for tree

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bird
        if (birdImg.complete) {
            ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        } else {
            // Fallback: draw red square if image not loaded
            ctx.fillStyle = 'red';
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        }

        // Draw trees (pipes as trees)
        pipes.forEach(pipe => {
            if (treeImg.complete) {
                // Draw top tree
                ctx.drawImage(treeImg, pipe.x, pipe.y, pipe.width, pipe.height);
                // Draw bottom tree
                ctx.drawImage(treeImg, pipe.x, pipe.height + 100, pipe.width, canvas.height - pipe.height - 100);
            } else {
                // Fallback: draw green rectangles if image not loaded
                ctx.fillStyle = 'green';
                ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
                ctx.fillRect(pipe.x, pipe.height + 100, pipe.width, canvas.height - pipe.height - 100);
            }

            // Move trees to the left
            pipe.x -= 2;

            // Recycle trees when they go off-screen
            if (pipe.x + pipe.width < 0) {
                pipe.x = 400;
                pipe.height = Math.random() * 200 + 50;
            }

            // Check collision with trees
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.height || bird.y + bird.height > pipe.height + 100)
            ) {
                alert('Game Over!');
                resetGame();
            }
        });

        // Apply gravity to bird
        bird.dy += gravity;
        bird.y += bird.dy;

        // Check collision with top and bottom borders
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            alert('Game Over!');
            resetGame();
        }
    }

    function jumpBird() {
        bird.dy = jump;
    }

    function resetGame() {
        bird.x = 50;
        bird.y = 200;
        bird.dy = 0;
        pipes.forEach(pipe => {
            pipe.x = 400;
            pipe.height = Math.random() * 200 + 50;
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jumpBird();
    });

    setInterval(draw, 20);
}

// Toggle Sidebar
document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
});

