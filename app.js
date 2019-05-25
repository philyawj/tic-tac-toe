/*
|--------------------------------------------------------------------------
| UI ELEMENTS / INIT GAME / STATES / PLAYERS
|--------------------------------------------------------------------------
*/

let boxes = document.querySelectorAll("td");
let box1 = document.querySelector("#one"),
  box2 = document.querySelector("#two"),
  box3 = document.querySelector("#three"),
  box4 = document.querySelector("#four"),
  box5 = document.querySelector("#five"),
  box6 = document.querySelector("#six"),
  box7 = document.querySelector("#seven"),
  box8 = document.querySelector("#eight"),
  box9 = document.querySelector("#nine");
let gameOverMsg = document.querySelector("#game-over-msg"),
  errorMsg = document.querySelector("#error-msg");
let btnPlayAgain = document.querySelector("#btn-play-again");
btnPlayAgain.addEventListener("click", resetGame);

let gameOver, playerTurn, moveCount, error, errorActive, playerX, playerO;
initGame();

function initGame() {
  gameOver = false;
  playerTurn = "playerX";
  moveCount = 0;
  errorActive = false;
}

/*
|--------------------------------------------------------------------------
| MAIN FUNCTION TO HANDLE THE CHOOSING OF BOXES
|--------------------------------------------------------------------------
|
| Loop through boxes so events can happen in each individual box
| If box is blank and game isn't over -> claim it and remove error if there was one
| If box is already taken -> display error
|
*/

boxes.forEach(function(box) {
  box.addEventListener("mouseup", function() {
    if (box.firstChild === null && gameOver === false) {
      checkBox(this);
    } else {
      displayError(this);
    }
  });
});

/*
|--------------------------------------------------------------------------
| PICK A BOX AND CLAIM OR ERROR
|--------------------------------------------------------------------------
*/

function checkBox(thisEl) {
  let letter, nextPlayer;
  if (playerTurn === "playerX" && gameOver === false) {
    letter = "x";
    nextPlayer = "playerO";
  } else if (playerTurn === "playerO" && gameOver === false) {
    letter = "o";
    nextPlayer = "playerX";
  }

  let newEl = document.createElement("img");
  newEl.setAttribute("src", `${letter}.png`);
  thisEl.appendChild(newEl);
  thisEl.className = `no-before ${letter}`;

  playerTurn = nextPlayer;

  // if error state then remove it with new successful placement
  if (errorActive === true) {
    stopErrorTimeout();
  }

  // check if game is won
  checkWinner();
}

function displayError(thisEl) {
  // only allow a single error string and only if game is still going
  if (
    thisEl.firstChild !== null &&
    errorMsg.style.display !== "block" &&
    gameOver === false
  ) {
    let errorEl = document.createTextNode("That box is taken...");
    errorMsg.appendChild(errorEl);
    errorMsg.style.display = "block";

    // error state true and start 2 second timeout to remove it
    errorActive = true;
    errorTimeout();
  }
}

/*
|--------------------------------------------------------------------------
| CHECK FOR WINNERS
|--------------------------------------------------------------------------
*/

function checkWinner() {
  // rows
  checkWinningCombo(box1, box2, box3);
  checkWinningCombo(box4, box5, box6);
  checkWinningCombo(box7, box8, box9);
  // columns
  checkWinningCombo(box1, box4, box7);
  checkWinningCombo(box2, box5, box8);
  checkWinningCombo(box3, box6, box9);
  // diagonals
  checkWinningCombo(box1, box5, box9);
  checkWinningCombo(box7, box5, box3);

  // increase moveCount to detect potential tie
  moveCount++;
  if (moveCount === 9 && gameOver === false) {
    endGame("cat");
  }
}

function checkWinningCombo(one, two, three) {
  let xRowCount = 0;
  let oRowCount = 0;
  [one, two, three].forEach(function(i) {
    if (i.className.includes("x")) {
      xRowCount++;
      if (xRowCount === 3) {
        endGame("X");
      }
    } else if (i.className.includes("o")) {
      oRowCount++;
      if (oRowCount === 3) {
        endGame("O");
      }
    }
  });
}

/*
|--------------------------------------------------------------------------
| END GAME AND OPTION TO REPLAY
|--------------------------------------------------------------------------
*/

function endGame(winner) {
  gameOver = true;
  let endEl;
  if (winner === "X" || winner == "O") {
    endEl = document.createTextNode(`${winner} wins!`);
  } else if (winner === "cat") {
    endEl = document.createTextNode("Cat's game. Meow.");
  }

  if (winner === "X") {
    gameOverMsg.className += "alert-danger";
  } else if (winner === "O") {
    gameOverMsg.className += "alert-primary";
  } else if (winner === "cat") {
    gameOverMsg.className += "alert-info";
  }

  gameOverMsg.appendChild(endEl);
  gameOverMsg.style.display = "block";

  newGameBtnShow();
}

// add new button to play again with a function to reset the game
function newGameBtnShow() {
  btnPlayAgain.style.display = "block";
}

function resetGame() {
  // reset game states
  initGame();

  // reset the board and alerts
  boxes.forEach(function(box) {
    box.className = "";
    if (box.firstChild) {
      box.firstChild.remove();
    }
  });
  gameOverMsg.className = "alert ";
  gameOverMsg.firstChild.remove();
  gameOverMsg.style.display = "none";
  btnPlayAgain.style.display = "none";
}

/*
|--------------------------------------------------------------------------
| TAKEN BOX ERROR HANDLING AND TIMEOUT
|--------------------------------------------------------------------------
*/

function errorTimeout() {
  error = setTimeout(removeError, 2000);
}

function removeError() {
  errorMsg.firstChild.remove();
  errorMsg.style.display = "none";
  errorActive = false;
}

function stopErrorTimeout() {
  clearTimeout(error);
  removeError();
}
