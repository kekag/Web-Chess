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

// Draw square color
function drawSquare(c, r) {
    var squareColor;
    var textColor;
    var light = "#CECECE";
    var dark = "#4A4A4A";
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

function initialize() {
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            p = setupPiece(c, r);
            populateBoard(c, r, p);
            drawSquare(c, r);
        }
    }
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
}

initialize()

function movePawn(c, r) {

}

function moveKnight(c, r) {

}

function moveBishop(c, r) {

}

function moveRook(c, r) {

}

function moveQueen(c, r) {

}

function moveKing(c, r) {

}

var highlightedPiece;
var movement;

document.addEventListener("click", e => {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    var c = Math.floor(x / s);
    var r = Math.floor(y / s);
    console.log(`col: ${c}, row: ${r}`);
    highlightedPiece = board[c][r];
});

function drawPieces() {
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (board[c][r].piece.type == type.BLANK) {
                continue;
            }
            var color, piece;

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
            ctx.drawImage(img, c*s, r*s, s, s);
        }
    }
}

function display() {
    drawPieces()
}
setInterval(display, 5)