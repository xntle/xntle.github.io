let tileSize = 32;
let rows = 16;
let columns = 16;

//board 

let board;
let boardW = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//ship variables ( alien )

let shipW = tileSize*2;
let shipH = tileSize;
let shipX = tileSize*columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x: shipX,
    y: shipY,
    width:shipW,
    height:shipH
}

let shipHor = tileSize;

let shipImg;

//alien variables (ship)

let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;

let alienMoveX = 1; //speed 


let bulletArray = [];
let bulletMoveY = -10; //speed

let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardW;
    board.height = boardHeight;
    context = board.getContext("2d"); 

    //ignore
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    //alien
    alienImg = new Image();
    alienImg.src = "./img/spaceShip.png"


    //ship
    shipImg = new Image();
    shipImg.src = "./img/space_invader.png";
    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);    
    }

    //bullet

    bulletImg = new Image();
    bulletImg.src = "./img/evilbullet.png";
    bulletImg.onload = function(){
        context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);    
    }

    createAliens();

    requestAnimationFrame(update);
    //move and shoot
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    
}

function update() {
    // game frame
    requestAnimationFrame(update);

    if(gameOver){
        return
        alert("Game Over");
    }

    context.clearRect(0,0,board.width,board.height);

    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    for (let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienMoveX;
            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienMoveX *= -1;
                alien.x += alienMoveX*2;

                for(let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            } 
            
            
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if(alien.y >= ship.y){
                gameOver = true;
            }
        }
    }


        //bullet
        for(let i = 0; i < bulletArray.length; i++){
            let bullet = bulletArray[i];
            bullet.y += bulletMoveY; // Use bulletMoveY for movement

            
            context.fillStyle="red";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);    
  

            for(let j = 0 ; j < alienArray.length; j++) {
                let alien = alienArray[j];
                if(!bullet.used && alien.alive && detectCollision(bullet, alien)){
                    bullet.used = true;
                    alien.alive = false;
                    alienCount--;
                }
            }
        }

        //clear bull
        while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
            bulletArray.shift();
        }

        if(alienCount == 0){
            alienColumns = Math.min(alienColumns + 1, columns/2 - 2);
            alienRows = Math.min(alienRows + 1, rows - 4);
            alienMoveX +=0.2;
            alienArray = [];
            bulletArray = [];
            createAliens();
        }
}

function moveShip(e) {
    // ship move on event
    if(gameOver){
        return;
    }

    if(e.code == "ArrowLeft" && ship.x - shipHor >= 0){
        ship.x -= shipHor;
    } else if (e.code == "ArrowRight" && ship.x + shipHor + ship.width <= boardW) {
        ship.x += shipHor;
    }
}

function createAliens() {
    //create an array of aliens
    for(let i = 0; i < alienColumns; i++){
        for(let j = 0; j < alienRows; j++){
            let alien = {
                img: alienImg,
                x: alienX + i*alienWidth,
                y: alienY + j*alienHeight,
                width : alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e){
    // shoot: create an array of bullets
    if(gameOver){
        resetGameState();
        alert("Game Over");
        return;
    }
    if(e.code == "Space"){
        let bullet = {
            x: ship.x + ship.width * 15/32,
            y: ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
        console.log(bulletArray);
    }
}
function detectCollision(a,b){
    // detect if 2 things collide
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
