const board = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('#status');
const resetButton = document.querySelector('#resetBtn');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer !== 'X') {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkWinner();

    if (gameActive) {
        currentPlayer = 'O';
        setTimeout(computerMove, 500); // Комп'ютер робить хід через 0.5 секунди
    }
}

function computerMove() {
    // 1. Спробуємо виграти
    let bestMove = findBestMove('O');
    // 2. Якщо не можемо виграти, спробуємо заблокувати суперника
    if (bestMove === null) {
        bestMove = findBestMove('X');
    }
    // 3. Якщо немає загрози або можливості виграти, зробимо випадковий хід
    if (bestMove === null) {
        bestMove = getRandomMove();
    }

    gameState[bestMove] = 'O';
    board[bestMove].innerHTML = 'O';
    checkWinner();

    if (gameActive) {
        currentPlayer = 'X';
        statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
    }
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === player && gameState[b] === player && gameState[c] === '') {
            return c;
        }
        if (gameState[a] === player && gameState[b] === '' && gameState[c] === player) {
            return b;
        }
        if (gameState[a] === '' && gameState[b] === player && gameState[c] === player) {
            return a;
        }
    }
    return null;
}

function getRandomMove() {
    const emptyCells = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerHTML = `Draw!`;
        gameActive = false;
        return;
    }
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = `Player X's turn`;
    board.forEach(cell => cell.innerHTML = '');
}

board.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
