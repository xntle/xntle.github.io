let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerUnits = { 'X': [], 'O': [] }; // Keep track of units placed by each player

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function makeMove(index) {
    if (gameActive && board[index] === '') {
        const currentPlayerUnits = playerUnits[currentPlayer];
        if (currentPlayerUnits.length >= 3) {
            // Remove earliest placed unit
            const earliestUnitIndex = currentPlayerUnits.shift();
            board[earliestUnitIndex] = '';
            document.getElementsByClassName('cell')[earliestUnitIndex].innerText = '';
        }
        // Add new unit
        currentPlayerUnits.push(index);
        
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;

        if (checkForWin()) {
            document.getElementById('message').innerText = `${currentPlayer} wins!`;
            gameActive = false;
        } else if (checkForDraw()) {
            document.getElementById('message').innerText = `It's a draw!`;
            gameActive = false;
        } else {

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            // Announce current player
            document.getElementById('message').innerText = `Current player: ${currentPlayer}`;

        }

    }
}

function checkForWin() {
    for (let combo of winningCombos) {
        if (board[combo[0]] !== '' && 
            board[combo[0]] === board[combo[1]] && 
            board[combo[1]] === board[combo[2]]) {
            document.getElementById('message').innerText = `${currentPlayer} WINS!`;
            alert(`${currentPlayer} WINS`);
            return true;
        }
    }
    return false;
}

function checkForDraw() {
    return !board.includes('');
}

function resetGame() {
    currentPlayer = 'X';
    document.getElementById('message').innerText = `Current player: ${currentPlayer}`;
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerUnits = { 'X': [], 'O': [] }; // Reset player units
    document.getElementById('message').innerText = `Current player: ${currentPlayer}`;
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
    }
}
