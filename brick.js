
// calculate dice and display result.
function rollDice() {
    var result = Math.floor(Math.random() * 6) + 1;
    displayResult(result);
}
// display the result of dice
function displayResult(result) {
    var diceElement = document.getElementById('dice');
    diceElement.textContent = result;
    document.getElementById('result').textContent = 'You rolled a ' + result;
}