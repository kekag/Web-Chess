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

function initialize() {
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
}

initialize()

function pawnMoves(pawn) {
    var possible;
    var c, r;
    if (pawn.piece.team == team.WHITE) {
        CR = getCR(pawn);
        c = CR[0];
        r = CR[1];
        if (board[c][r-1].piece.type == type.BLANK) {
            possible.push(board[c][r-1]);
        }

    } else {

    }
}

function knightMoves(knight) {

}

function bishopMoves(bishop) {

}

function rookMoves(rook) {

}

function queenMoves(queen) {

}

function kingMoves(king) {

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
    var dark = "#555555";
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