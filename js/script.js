var canvas = document.getElementById("boardCanvas");
var ctx = canvas.getContext("2d");

var s = canvas.width / 8;

// Define piece enums
const type = {
    PAWN:   "pawn",
    KNIGHT: "knight",
    BISHOP: "bishop",
    ROOK:   "rook",
    QUEEN:  "queen",
    KING:   "king",
    BLANK:  "blank",
}

const team = {
    WHITE: "white",
    BLACK: "black",
}

// Create board as 2D-arrary
var board = new Array(8);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
}

function getCR(temp) {
    var c = temp.col.charCodeAt(0) - 97;
    var r = -temp.row + 8;
    return [c, r]
}

// Determine starting position for specific [c][r] square
function setupPiece(c, r) {
    var p, t;
    if (r == 1 || r == 6) { // Minor pieces (second rank)
        p = type.PAWN;
    } else if (r == 0 || r == 7) { // Major pieces (first rank)
        if (c == 0 || c == 7) {
            p = type.ROOK;
        } else if (c == 1 || c == 6) {
            p = type.KNIGHT;
        } else if (c == 2 || c == 5) {
            p = type.BISHOP;
        } else if (c == 3) {
            p = type.QUEEN;
        } else {
            p = type.KING;
        }
    } else {
        var empty = {
            type: type.BLANK,
        } 
        return  empty
    }
    r >= 4 ? t = team.WHITE : t = team.BLACK;
    var piece = {
        type: p,
        team: t, 
    }
    return piece
}

// Create and set square object
function populateBoard(c, r, p) {
    // column first, row second e.g.
    // board[0][0] -> a8
    // board[7][7] -> h1
    var square = {
        col:   String.fromCharCode(97 + c),
        row:   -(r - 8),
        piece: p,
    }
    board[c][r] = square;
}

// INITIALIZE PIECES AND BOARD
for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 8; r++) {
        p = setupPiece(c, r);
        populateBoard(c, r, p);
    }
}
ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
ctx.stroke();
ctx.closePath();

/* PIECE MOVEMENT FUNCTIONS ASSUME THE PIECES ARE NOT PINNED */

function pawnMoves(pawn) {
    var possible, d, c, r;
    pawn.piece.team == team.WHITE ? d = -1 : d = 1;
    CR = getCR(pawn);
    c = CR[0]; r = CR[1];

    // Assume any possible move can be played then restrict
    var s = r+d;
    for (var i = -1; i <= 1; i++) {
        var t = c+i;
        if (t >= 0 && t < 8) { // in board boundaries
            if (c == t && board[t][s].piece.type == type.BLANK) { // opposite tile
                possible.push([t, s]);
            } else if (c != t && board[t][s].piece.type != type.BLANK) { // diagonal tile(s)
                possible.push([t, s]);
            }
        }
    }

    return possible;
}

function knightMoves(knight) {
    var possible, c, r;
    CR = getCR(knight);
    c = CR[0]; r = CR[1];
    
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            var t = c+i;
            var s = r+j;
            // L shaped movement — In boundaries — Not team's piece
            if (Math.abs(i)+Math.abs(j) == 3 && t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].piece.team != knight.piece.team) {
                possible.push([t, s]);
            }
        }
    }

    return possible;
}

function bishopMoves(bishop) {
    var possible, c, r;
    CR = getCR(bishop);
    c = CR[0]; r = CR[1];

    for (var i = -1; i >= -c; i--) { // UPLEFT
        var t = c+i;
        var s = r+i;
        if (t < 0 || s < 0) break;
        if (board[t][s].piece.type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].piece.team != bishop.piece.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (var i = 1; i < 8-c; i++) { // DOWNLEFT
        var t = c+i;
        var s = r+i;
        if (t < 0 || s >= 8) break;
        if (board[t][s].piece.type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].piece.team != bishop.piece.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (var j = -1; j >= -r; j--) { // DOWNRIGHT
        var t = c+i;
        var s = r+i;
        if (t >= 8 || s >= 8) break;
        if (board[t][s].piece.type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].piece.team != bishop.piece.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (var j = 1; j < 8-r; j++) { // UPRIGHT
        var t = c+i;
        var s = r+i;
        if (t >= 8 || s < 0) break;
        if (board[t][s].piece.type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].piece.team != bishop.piece.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }

    return possible;
}

function rookMoves(rook) {
    var possible, c, r;
    CR = getCR(rook);
    c = CR[0]; r = CR[1];

    for (var i = -1; i >= -c; i--) { // LEFT
        var t = c+i;
        if (board[t][r].piece.type == type.BLANK) {
            possible.push([t, r]);
        } else if (board[t][r].piece.team != rook.piece.team) {
            possible.push([t, r]);
            break;
        } else {
            break;
        }
    }
    for (var i = 1; i < 8-c; i++) { // RIGHT
        var t = c+i;
        if (board[t][r].piece.type == type.BLANK) {
            possible.push([t, r]);
        } else if (board[t][r].piece.team != rook.piece.team) {
            possible.push([t, r]);
            break;
        } else {
            break;
        }
    }
    for (var j = -1; j >= -r; j--) { // UP
        var s = r+j;
        if (board[c][s].piece.type == type.BLANK) {
            possible.push([t, r]);
        } else if (board[c][s].piece.team != rook.piece.team) {
            possible.push([c, s]);
            break;
        } else {
            break;
        }
    }
    for (var j = 1; j < 8-r; j++) { // DOWN
        var s = r+j;
        if (board[c][s].piece.type == type.BLANK) {
            possible.push([c, s]);
        } else if (board[c][s].piece.team != rook.piece.team) {
            possible.push([c, s]);
            break;
        } else {
            break;
        }
    }

    return possible;
}

function queenMoves(queen) {
    var bishop = bishopMoves(queen);
    var rook = rookMoves(queen);
    return bishop.concat(rook);
}

// Assumes pieces aren't protected
function kingMoves(king) {
    var possible, c, r;
    CR = getCR(king);
    c = CR[0]; r = CR[1];
    
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var t = c+i;
            var s = r+j;
            // L shaped movement — In boundaries — Not team's piece
            if (t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].piece.team != king.piece.team) {
                possible.push([t, s]);
            }
        }
    }

    return possible;
}

var highlight, move;
var down, drag;
var pos;

function setPosition(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    pos = [x, y];
}

function getSquare(e) {
    setPosition(e)
    var x = pos[0];
    var y = pos[1];
    if (x >= 0 && x <= 720 && y >= 0 && y <= 720) {
        var c = Math.floor(x / s);
        var r = Math.floor(y / s);
        return board[c][r];
    }
    return undefined
}

function highlightPiece(temp) {
    if (highlight == temp) return;
    highlight = temp;
    if (highlight != undefined && highlight.piece.type != type.BLANK) {
        console.log(`HIGHLIGHT col: ${highlight.col}, row: ${highlight.row}`);
    }
    move = undefined;
}

function movePiece(temp) {
    if (highlight == temp || move == temp) return;
    if (highlight == undefined) {
        highlight = temp;
    }
    move = temp;
    if (move != undefined && highlight.piece.type != type.BLANK) {
        console.log(`MOVE col: ${move.col}, row: ${move.row}`);
    }
    switch(highlight.piece.type) {
        case type.PAWN:
            piece = "P";
            break;
        case type.KNIGHT:
            piece = "N";
            break;
        case type.BISHOP:
            piece = "B";
            break;
        case type.ROOK:
            piece = "R";
            break;
        case type.QUEEN:
            piece = "Q";
            break;
        case type.KING:
            piece = "K";
            break;
    }
}

document.addEventListener("click", e => {
    down = false;
    if (highlight == undefined) return;
    if (drag) { // Dropped from drag
        drag = false;
        temp = getSquare(e);
        movePiece(temp);
    }
});

document.addEventListener('mousedown', e => {
    down = true;
    temp = getSquare(e);
    highlightPiece(temp);
    movePiece(temp);
});
  
document.addEventListener('mousemove', e => {
    if (down) {
        drag = true;
        setPosition(e);
    }
});

function drawSquare(c, r) {
    var squareColor, textColor;
    var light = "#CCCCCC";
    var dark = "#5A5A5A";
    if (c % 2 == 0) {
        r % 2 == 0 ? squareColor = light : squareColor = dark;
    } else {
        r % 2 == 0 ? squareColor = dark : squareColor = light;
    }
    squareColor == light ? textColor = dark : textColor = light;

    ctx.beginPath();
    ctx.rect(c*s, r*s, s, s);
    ctx.fillStyle = squareColor;
    ctx.fill();
    ctx.closePath();

    if (r == 7) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(board[c][r].col.toUpperCase(), c*s + s - s/6, r*s + 86);
    }
    if (c == 0) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(board[c][r].row, c*s + 4, r*s + s/6);
    }
}

function drawPiece(c, r) {
    if (board[c][r].piece.type == type.BLANK) {
        return;
    }
    var color, piece;
    var x, y;
    board[c][r].piece.team == team.WHITE ? color = "w" : color = "b";
    switch(board[c][r].piece.type) {
        case type.PAWN:
            piece = "P";
            break;
        case type.KNIGHT:
            piece = "N";
            break;
        case type.BISHOP:
            piece = "B";
            break;
        case type.ROOK:
            piece = "R";
            break;
        case type.QUEEN:
            piece = "Q";
            break;
        case type.KING:
            piece = "K";
            break;
    }
    var img = new Image(s, s);
    img.src = `sprites/${color}${piece}.svg`
    if (board[c][r] == highlight) {
        if (drag) {
            x = pos[0] - s/2;
            y = pos[1] - s/2;
        } else {
            x = c*s;
            y = r*s;
        }
    } else if (board[c][r] != highlight) {
        x = c*s;
        y = r*s;
    }
    ctx.drawImage(img, x, y, s, s);
}

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            drawSquare(c, r);
        }
    }
    var precedent = false;
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (highlight != undefined && !precedent) {
                if (highlight.piece.type != type.BLANK) {
                    precedent = true;
                    var CR = getCR(highlight);
                    drawPiece(CR[0], CR[1]);
                }
            }
            drawPiece(c, r);
        }
    }

}
setInterval(display, 5)