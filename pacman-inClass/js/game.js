'use strict'
const WALL = '#';
const FOOD = '.';
const EMPTY = ' ';
const SUPER = '*';
const CHERRY = '🍒'

var gIntervalCherry

var gBoard;
var gGame = {
    score: 0,
    isOn: false
}

function init() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none'
    console.log('hello')
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container')
    gGame.isOn = true;
    gIntervalCherry = setInterval(addCherry, 15000)
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            }
        }
    }
    board[1][1] = SUPER
    board[1][board.length - 2] = SUPER
    board[board.length - 2][1] = SUPER
    board[board.length - 2][board.length - 2] = SUPER
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;

}

function gameOver() {
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    renderCell(gPacman.location, EMPTY);
    onLoss()

}

function onVictory() {
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2').innerText = 'Great! You won!'
    elModal.style.display = 'block'
    clearInterval(gIntervalCherry)
}

function onLoss() {
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h2').innerText = 'Maybe next time...'
    elModal.style.display = 'block'
    clearInterval(gIntervalCherry)
}


function checkVictory() {
    console.log('checking')

    for (var i = 1; i < gGhosts.length - 1; i++) {
        if (gGhosts[i].currCellContent === FOOD) return
    }
    console.log('victory')
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    onVictory()
}


function kilGhost(ghostLoc, kiler, nextGhostLoc) {
    var deadGhosts = []
    for (var i = 0; i < gGhosts.length; i++) {
        if (ghostLoc.i === gGhosts[i].location.i && ghostLoc.j === gGhosts[i].location.j) {
            deadGhosts.push(gGhosts.splice(i, 1)[0])
            if(gGhosts[i]===FOOD){
                updateScore(1)
                gGhosts[i].currCellContent = EMPTY
            }
        }
    }
    if (kiler === 'pacman') {
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        renderCell(gPacman.location, EMPTY)
        gPacman.location.i = ghostLoc.i
        gPacman.location.j = ghostLoc.j
        renderCell(ghostLoc, PACMAN)
        setTimeout(reviveGhost, 5000, deadGhosts)
    }
    else {
        gBoard[ghostLoc.i][ghostLoc.j] = EMPTY
        renderCell(ghostLoc, EMPTY)
        deadGhosts[0].location.i = nextGhostLoc.i
        deadGhosts[0].location.j = nextGhostLoc.j
        setTimeout(reviveGhost, 5000, deadGhosts)
    }
}
function reviveGhost(deadGhost) {
    var revived = deadGhost.splice(0, 1)[0]
    gGhosts.push(revived)
    renderCell(revived.location, GHOST)
}

function addCherry() {
    var location = randomEmptyCell()
    gBoard[location.i][location.j]
    renderCell(location, CHERRY)
}
function randomEmptyCell() {
    var map = getBoardMap()
    var randomIdx = getRandomIntInclusive(0, map.emptyCell.length - 1)
    return map.emptyCell[randomIdx]
}
function getBoardMap() {
    var map = {foodCount:0,emptyCell:[]}
    for (var i = 1; i < gBoard.length - 1; i++) {
        for (var j = 1; j < gBoard[0].length - 1; j++) {

            if (gBoard[i][j] === FOOD) map.foodCount ++
            else if(gBoard[i][j]=== EMPTY){
                map.emptyCell.push({i:i,j:j})
            }
        }
    }

}
