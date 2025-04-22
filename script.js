const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

let board = Array(9).fill("");
let currentPlayer = "X";
let playerMoves = {
  X: [],
  O: []
};

function renderBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const mark = board[i];

    if (mark !== "") {
      cell.textContent = mark;
      cell.classList.add(mark === "X" ? "red" : "blue");
    }

    const moves = playerMoves[currentPlayer];
    const isDecayMove = moves.length === 3 && moves[0] === i;

    // Avoid applying decay on winning cells
    if (isDecayMove && !isWinningCell(i)) {
      cell.classList.add("about-to-decay");
    }

    cell.addEventListener("click", () => handleMove(i));
    boardElement.appendChild(cell);
  }
}

function handleMove(index) {
  if (board[index] !== "") return;

  const moves = playerMoves[currentPlayer];
  if (moves.length === 3) {
    // Decay happens on the player's 4th move, shift the oldest move to clear the spot
    const decayIndex = moves.shift();
    board[decayIndex] = "";
  }

  board[index] = currentPlayer;
  moves.push(index);

  // Render the board after the move to show the placement
  renderBoard();

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    highlightWinningCombination(currentPlayer);
    boardElement.querySelectorAll('.cell').forEach(cell => cell.style.pointerEvents = 'none');
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winCombos.some(combo =>
    combo.every(i => board[i] === player)
  );
}

function isWinningCell(cellIndex) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winCombos.some(combo => combo.includes(cellIndex) && combo.every(i => board[i] === currentPlayer));
}

function highlightWinningCombination(player) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const winningCombo = winCombos.find(combo =>
    combo.every(i => board[i] === player)
  );

  if (winningCombo) {
    winningCombo.forEach(index => {
      const cell = boardElement.children[index];
      cell.classList.add("winning-cell"); // Add a class to highlight the winning cells
    });
  }
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  playerMoves = { X: [], O: [] };
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

renderBoard();
