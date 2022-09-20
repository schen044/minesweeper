/*----- constants -----*/
const numMines = 3;
const boardSize = 5;
// class to help construct each board square
class boardSquare {
    constructor(numAdjacent, isMine, flagged, revealed, tileType) {
        // hint value, number of mines adjacent to this square
        this.numAdjacent = numAdjacent;
        // is a mine or safe square
        this.isMine = isMine;
        // is flagged as a mine
        this.flagged = flagged;
        // reveal this square?
        this.revealed = revealed;
        // corner, edge, center - used for calculating numAdjacent
        this.tileType = tileType;
    }
}

/*----- state variables -----*/
let firstClick, gameBoard, win;

/*----- cached elements  -----*/
// win message
const winMessageDisplayEl = document.querySelector('.win');
// reset button
const resetButtonEl = document.getElementById('reset')
// board element
const boardEl = document.querySelector('.board');

/*----- event listeners -----*/
// listen for reset press
resetButtonEl.addEventListener('click', handleResetClick);
//listen for left click to reveal
boardEl.addEventListener('click', handleLeftClick);
// //listen for right click to flag
boardEl.addEventListener('contextmenu', handleRightClick);

/*----- functions -----*/
// initialization
function initialize() {
    // reset first click
    firstClick = true;
    // reset board state
    gameBoard = [];
    initBoardArray(numMines, boardSize)
    // reset win state
    win = null;
    // render to DOM
    //render();
}

// reset
function handleResetClick() {
    //console.log("reset clicked");
    initialize();
}

// initialize board array
function initBoardArray(numMines, size) {
    for (let i = 0; i < size * size; i++) {
        // create mine objects
        if (i < numMines) {
            gameBoard[i] = new boardSquare(0, true, false, false, '');
            // create safe squares
        } else {
            gameBoard[i] = new boardSquare(0, false, false, false, '');
        }
    }
}

// generate mines
function generateBoard(arr, clickIdx) {
    // randomize locations
    shuffleBoard(arr);
    // ensure first click is not a mine
    while(arr[clickIdx].isMine) {
        randomNum = Math.floor(Math.random() * clickIdx);
        swap(arr, clickIdx, randomNum);
    }
    // sets the location tag for 
    // each square to identify which rules
    // to use when revealing tiles
    addSquareInfo(arr);
}

// left click during gameplay
function handleLeftClick(evt) {
    evt.preventDefault();
    // link the clicked square to index value to be used by board array
    const clickIdx = (evt.target.id[5] + evt.target.id[6]) - 1;
    // check if first click
    if (firstClick) {
        //console.log('firstClick is false');
        firstClick = false;
        generateBoard(gameBoard, clickIdx);
    }
    if (gameBoard[clickIdx].isMine) {
        win = false;
        return;
    }
    console.log(evt, clickIdx);
}

// left click during gameplay
function handleRightClick(evt) {
        //console.log('right click clicked');
        evt.preventDefault();
        const clickIdx = (evt.target.id[5] + evt.target.id[6]) - 1;
        gameBoard[clickIdx].flagged = true;
}

// randomize mine positions
/* using the Fisher-Yates shuffle algorithm as found on stack overflow */
function shuffleBoard(arr) {
    for(let i = 0; i < arr.length; i++) {
        // randomly generate the index of the square the
        // current square will swap with
        let randomIdx = Math.floor(Math.random() * i);
        // swap the two object positions
        swap(arr, i, randomIdx);
    }
}

// swap the position of two square objects
function swap (arr, index1, index2) {
    let tempSquare = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = tempSquare;
}

// calculate adjacency hints and assign location types
function addSquareInfo(arr) {
    for (let i = 0; i < arr.length; i++) {
        // upper left corner
        if (i === 0) {
            arr[i].tileType = 'topleft';
            arr[i + 1].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i + 1 + boardSize].numAdjacent += 1;
            // upper right corner
        } else if (i === boardSize - 1) {
            arr[i].tileType = 'topright';
            arr[i - 1].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i + boardSize - 1].numAdjacent += 1;
            // lower left corner
        } else if (i === boardSize * (boardSize - 1)) {
            arr[i].tileType = 'bottomleft';
            arr[i + 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i + 1 - boardSize].numAdjacent += 1;
            // lower right corner
        } else if (i === (boardSize * boardSize) - 1) {
            arr[i].tileType = 'bottomright';
            arr[i - 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i - 1 - boardSize].numAdjacent += 1;
            // top edge
        } else if (i < boardSize - 1) {
            arr[i].tileType = 'top';
            arr[i - 1].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i - 1 + boardSize].numAdjacent += 1;
            arr[i + 1].numAdjacent += 1;
            arr[i + 1 + boardSize].numAdjacent += 1;
            // bottom edge
        } else if (i > boardSize * (boardSize - 1)) {
            arr[i].tileType = 'bottom';
            arr[i - 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i - 1 - boardSize].numAdjacent += 1;
            arr[i + 1].numAdjacent += 1;
            arr[i - 1 - boardSize].numAdjacent += 1;
            // left edge
        } else if (i % boardSize === 0) {
            arr[i].tileType = 'left';
            arr[i + 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i + 1 - boardSize].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i + 1 + boardSize].numAdjacent += 1;
            // right edge
        } else if (i % boardSize === 4) {
            arr[i].tileType = 'right';
            arr[i - 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i - 1 - boardSize].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i - 1 + boardSize].numAdjacent += 1;
            // center
        } else {
            arr[i].tileType = 'center';
            arr[i - boardSize - 1].numAdjacent += 1;
            arr[i - boardSize].numAdjacent += 1;
            arr[i + 1 - boardSize].numAdjacent += 1;
            arr[i + boardSize].numAdjacent += 1;
            arr[i + 1 + boardSize].numAdjacent += 1;
            arr[i + boardSize -1].numAdjacent += 1;
            arr[i + 1].numAdjacent += 1;
            arr[i - 1].numAdjacent += 1;
        }
    }
}

initialize();
if (win) {
    winMessageDisplayEl.innerText = "You Won"
}
else if (win === false) {
    winMessageDisplayEl.innerText = "You Lost"
}
else {
    winMessageDisplayEl.innerText = '';
}