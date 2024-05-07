let tileSize = 32;
let rows = 16;
let columns = 16;

// Board variables
let board;
let boardW = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// Ship variables
let shipW = tileSize * 2;
let shipH = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipW,
    height: shipH
}

let shipHor = tileSize;

let shipImg;

// Alien variables
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;

let alienMoveX = 1; // Speed 

// Bullet variables
let bulletArray = [];
let bulletMoveY = -10; // Speed

let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardW;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Ignore keyboard events
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    // Load ship image
    shipImg = new Image();
    shipImg.src = "./img/space_invader.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    // Load alien image
    alienImg = new Image();
    alienImg.src = "./img/spaceShip.png";
    alienImg.onload = createAliens;

    // Start the game loop
    requestAnimationFrame(update);

    // Move ship and shoot
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    // Game loop
    requestAnimationFrame(update);

    if (gameOver) {
        return;
        alert("Game Over");
    }

    context.clearRect(0, 0, board.width, board.height);

    // Draw ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Draw aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienMoveX;
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienMoveX *= -1;
                alien.x += alienMoveX * 2;

                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // Draw bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletMoveY;

        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Draw bullet image
        context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        // Check for collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
            }
        }
    }

    // Remove used bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    // Check if all aliens are destroyed
    if (alienCount == 0) {
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienMoveX += 0.2;
        alienArray = [];
        bulletArray = [];
        createAliens();
    }
}

function moveShip(e) {
    // Move ship based on keyboard input
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && ship.x - shipHor >= 0) {
        ship.x -= shipHor;
    } else if (e.code == "ArrowRight" && ship.x + shipHor + ship.width <= boardW) {
        ship.x += shipHor;
    }
}

function createAliens() {
    // Create an array of aliens
    for (let i = 0; i < alienColumns; i++) {
        for (let j = 0; j < alienRows; j++) {
            let alien = {
                img: alienImg,
                x: alienX + i * alienWidth,
                y: alienY + j * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    // Create bullets when spacebar is pressed
    if (gameOver) {
        resetGameState();
        alert("Game Over");
        return;
    }
    if (e.code == "Space") {
        let bullet = {
            x: ship.x + ship.width * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    // Detect collision between two objects
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
