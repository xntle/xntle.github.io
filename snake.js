// board
var blockSize = 25;
var row = 20;
var col = 20;
var board;
var context;

//snake
var snakePosX = blockSize * 5;
var snakePosY = blockSize * 5;
var snakeTail = [];

//direction snake
var dirX = 0;
var dirY = 0;


//food
var foodPosX;
var foodPosY;

var gameOver;


window.onload = function() {
    //board create
    board = document.getElementById("board");
    board.height = row * blockSize;
    board.width = col * blockSize;
    context = board.getContext("2d");
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    //FOOD CREATE
    makeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(gameUpdate, 100);

}


// if changeing direction
function changeDirection(event){
    if(event.code == "ArrowUp"){
        dirX = 0;
        dirY = -1;
    }
    else if(event.code == "ArrowDown"){
        dirX = 0;
        dirY = 1;
    }
    else if(event.code == "ArrowLeft"){
        dirX = -1;
        dirY = 0;
    }
    else if(event.code == "ArrowRight"){
        dirX = 1;
        dirY = 0;
    }

}

//update the game
function gameUpdate(){
    context.fillStyle="black";
    context.fillRect(0,0, board.width, board.height);

    context.fillStyle="#ffe96a";
    context.fillRect(foodPosX,foodPosY, blockSize, blockSize);

    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        snakeTail.push([foodPosX, foodPosY]);
        makeFood();
    } 

    for(let i = snakeTail.length - 1 ; i > 0; i--){
        snakeTail[i] = snakeTail[i - 1];
    }
    if(snakeTail.length) {
        snakeTail[0] = [snakePosX,snakePosY];
    }
    context.fillStyle="#5a54ff";
    snakePosX += blockSize * dirX;
    snakePosY += blockSize * dirY;
    context.fillRect(snakePosX,snakePosY, blockSize, blockSize);
    for(let i = 0; i < snakeTail.length; i++){
        context.fillRect(snakeTail[i][0], snakeTail[i][1], blockSize, blockSize)
    }

    //game over
    if (snakePosX < 0 || snakePosX >= col * blockSize || snakePosY < 0 || snakePosY >= row * blockSize) {
        gameOver = true;
        alert("Game Over, play again?");
        resetGame()
    }
    
    for (let i = 1; i < snakeTail.length; i++) {
        if (snakePosX === snakeTail[i][0] && snakePosY === snakeTail[i][1]) {
            gameOver = true;
            alert("Game Over, play again?");
            resetGame()
        }
    }


}

//random food position within canvas
function makeFood() {
    foodPosX = Math.floor(Math.random() * col) * blockSize;
    foodPosY = Math.floor(Math.random() * row) * blockSize;
}

//reset the game, evrything is back to normal
function resetGame() {
    snakePosX = blockSize * 5;
    snakePosY = blockSize * 5;
    snakeTail = [];
    makeFood();
    gameOver = false;
    dirX = 0;
    dirY = 0;
}