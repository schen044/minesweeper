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
let firstClick, gameBoard, win, numFlags, winCount = 0;

/*----- cached elements  -----*/
// win message
const winMessageDisplayEl = document.querySelector('.win');
// reset button
const resetButtonEl = document.getElementById('reset');
// board element
const boardEl = document.querySelector('.board');
// flag count element
const flagCountEl = document.querySelector('#flag-count');
// win count element
const winCountEl = document.querySelector('#win-count');

/*----- event listeners -----*/
// listen for reset press
resetButtonEl.addEventListener('click', handleResetClick);
//listen for left click to reveal
boardEl.addEventListener('click', handleLeftClick);
// //listen for right click to flag
boardEl.addEventListener('contextmenu', flagTile);

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
    // reset flag count
    numFlags = numMines;
    // reset win message
    winMessageDisplayEl.innerHTML= '';
    // reset reset button image
    resetButtonEl.innerText = '🙂';
    // render to DOM
    render();
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
    addTileInfo(arr);
}

// left click during gameplay
function handleLeftClick(evt) {
    evt.preventDefault();
    // link the clicked square to index value to be used by board array
    const clickIdx = Number(evt.target.id[5] + evt.target.id[6]);
    // check if first click
    if (firstClick) {
        //console.log('firstClick is false');
        firstClick = false;
        generateBoard(gameBoard, clickIdx);
    }
    // click on flag
    if (gameBoard[clickIdx].flagged) {
        gameBoard[clickIdx].flagged = false;
        numFlags++;
    }
    // click on mine
    if (gameBoard[clickIdx].isMine) {
        win = false;
        render(clickIdx);
        // click on safe tile
    } else {
        // reveal hints
        reveal(clickIdx);
        // check win - must be before render to set win state
        checkWin();
        // render to DOM
        render(clickIdx);
    }
    // console log board
    clog();
    //console.log(evt, clickIdx);
}

// right click during gameplay
function flagTile(evt) {
    //console.log('right click clicked');
    evt.preventDefault();
    const clickIdx = Number(evt.target.id[5] + evt.target.id[6]);
    // prevent first click flag
    if (firstClick) {
        return;
    }
    // if tile is already flagged and not revealed, unflag tile
    if (gameBoard[clickIdx].flagged && !gameBoard[clickIdx].revealed)
    {
        // add a flag to the count
        numFlags++;
        gameBoard[clickIdx].flagged = false;
    // if tile is revealed, don't do anything, otherwise:
    } else if (!gameBoard[clickIdx].revealed) {
        // remove a flag from the count
        numFlags--
        gameBoard[clickIdx].flagged = true;
    }
    render(clickIdx);
}

// randomize mine positions
/* using the Fisher-Yates shuffle algorithm as found on stack overflow */
function shuffleBoard(arr) {
    for (let i = 0; i < arr.length; i++) {
        // randomly generate the index of the square the
        // current square will swap with
        let randomIdx = Math.floor(Math.random() * i);
        // swap the two object positions
        swap(arr, i, randomIdx);
    }
}

// swap the position of two square objects
function swap(arr, index1, index2) {
    // temporary variable to store value so it's not lost
    let tempSquare = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = tempSquare;
}

// calculate adjacency hints and assign location types
function addTileInfo(arr) {
    let adjacentArray;
    for (let i = 0; i < arr.length; i++) {
        /* assign tile types */
        // upper left corner
        if (i === 0) {
            arr[i].tileType = 'topleft';
            // upper right corner
        } else if (i === boardSize - 1) {
            arr[i].tileType = 'topright';
            // lower left corner
        } else if (i === boardSize * (boardSize - 1)) {
            arr[i].tileType = 'bottomleft';
            // lower right corner
        } else if (i === (boardSize * boardSize) - 1) {
            arr[i].tileType = 'bottomright';
            // top edge
        } else if (i < boardSize - 1) {
            arr[i].tileType = 'top';
            // bottom edge
        } else if (i > boardSize * (boardSize - 1)) {
            arr[i].tileType = 'bottom';
            // left edge
        } else if (i % boardSize === 0) {
            arr[i].tileType = 'left';
            // right edge
        } else if (i % boardSize === 4) {
            arr[i].tileType = 'right';
            // center
        } else {
            arr[i].tileType = 'center';
        }
        // generate hints for tiles adjacent to mines
        adjacentArray = getAdjTile(i);
        if (arr[i].isMine) {
            addAdjacent(adjacentArray);
        }
    }
}

// switch statement for adjacent squares
// returns an array to iterate through for each function
function getAdjTile (i) {
    switch(gameBoard[i].tileType) {
        case 'topleft':
            return [i + 1, i + boardSize, i + boardSize + 1];
        case 'topright':
            return [ i - 1, i + boardSize, i + boardSize - 1];
        case 'bottomleft':
            return [ i + 1,  i - boardSize,  i - boardSize + 1];
        case 'bottomright':
            return [ i - 1,  i - boardSize,  i - boardSize - 1];
        case 'top':
            return [ i - 1,  i + boardSize - 1,  i + boardSize,  i + boardSize + 1,  i + 1];
        case 'bottom':
            return [ i - 1,  i - boardSize - 1,  i - boardSize,  i - boardSize + 1,  i + 1];
            case 'left':
                return [ i - boardSize,  i - boardSize + 1,  i + 1,  i + boardSize + 1,  i + boardSize];
        case 'right':
            return [ i - boardSize,  i - boardSize - 1,  i - 1,  i + boardSize - 1,  i + boardSize];
        case 'center':
            return [ i - boardSize - 1,  i - boardSize,  i + 1 - boardSize,  i + boardSize,  i + 1 + boardSize,  i + boardSize -1,  i + 1, i - 1];
        default:
            console.log('out of board range');
            break;
    }
}

// add one to numAdjacent for each adjacent tile for adjacent mine hints
function addAdjacent(adjArr) {
    adjArr.forEach(function(adjIdx) {
        gameBoard[adjIdx].numAdjacent += 1;   
    })
}

// reveal adjacent squares
function reveal(clickIdx) {
    let adjArray = getAdjTile(clickIdx);
    if (!gameBoard[clickIdx].revealed) {
        gameBoard[clickIdx].revealed = true;
        if (gameBoard[clickIdx].numAdjacent === 0) {
            adjArray.forEach(function(adjIdx) {
                reveal(adjIdx);
            })
        }
    }
}

// render game board to DOM
function render(clickIndex) {
    let clickIdxStr;
    // clicked a mine, lost
    if (win === false) {
        // reveal bomb locations
        clickIdxStr = indexToString(clickIndex);
        showBomb();
        // turn bomb that was clicked into detonated symbol
        document.getElementById(`grid-${clickIdxStr}`).textContent = '💥';
        // turn smiley into skull
        resetButtonEl.innerText = '💀';
        // display lose text
        winMessageDisplayEl.innerHTML= '<h3>You Lose</h3>';
    } else {
        let idxStr;
        // show safe tiles
        gameBoard.forEach(function(tile, idx) {
            idxStr = indexToString(idx);
            // show hints of tiles
            if (tile.revealed && (!tile.ismine || !tile.flagged)) {
                document.getElementById(`grid-${idxStr}`).textContent = gameBoard[idx].numAdjacent;
                // flag unflagged tile
            } else if (tile.flagged) {
                document.getElementById(`grid-${idxStr}`).textContent = '🚩';
                // remove flag
            } else if (!tile.flagged) {
                document.getElementById(`grid-${idxStr}`).textContent = '';
            }})
        }
    // render flag count
    flagCountEl.innerText = 'Flags:' + numFlags;
    // render win count
    winCountEl.innerText = 'Wins:' + winCount;
    // revealed all safe tiles, won
    if (win === true) {
        // reveal bomb locations
        showBomb();
        // turn smiley into cool smiley
        resetButtonEl.innerText = '😎';
        // display win text
        winMessageDisplayEl.innerHTML= '<h3>You Win!</h3>';
    }
}

// convert index number to string for string interpolation
function indexToString(idx) {
    let tileIdx = idx.toString();
    return tileIdx.padStart(2, '0');
}

// reveal location of all bombs
function showBomb() {
    gameBoard.forEach(function(tile, idx) {
        let idxStr = indexToString(idx);
        if (tile.isMine) {
            document.getElementById(`grid-${idxStr}`).textContent = '💣';
        }
    })
}

// check if won
function checkWin() {
    let total = 0;
    gameBoard.forEach(function(tile) {
        if (tile.revealed) {
            total += 1;
        }
        console.log(total);
    })
    if (total === gameBoard.length - numMines) {
        win = true;
        winCount++;
    }
}

// debugger for checking state of game board
function clog() {
    let mineStr = '';
    for (let i = 0; i < 25; i++) {
        if (gameBoard[i].isMine) {
            mineStr += 'x';
        } else if (gameBoard[i].revealed) {
            mineStr += 'R';
        } else {
            mineStr += '' + gameBoard[i].numAdjacent;
        }
        if ((i+1) % 5 === 0) {
            mineStr += '\n';
        }
    }
    console.log(mineStr);
}

initialize();