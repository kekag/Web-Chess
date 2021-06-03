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
const board = new Array(8);
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
    var p, t, l;
    if (r == 1 || r == 6) { // Minor pieces (second rank)
        p = type.PAWN;
        l = "P";
    } else if (r == 0 || r == 7) { // Major pieces (first rank)
        if (c == 0 || c == 7) {
            p = type.ROOK;
            l = "R";
        } else if (c == 1 || c == 6) {
            p = type.KNIGHT;
            l = "N";
        } else if (c == 2 || c == 5) {
            p = type.BISHOP;
            l = "B";
        } else if (c == 3) {
            p = type.QUEEN;
            l = "Q";
        } else {
            p = type.KING;
            l = "K";
        }
    } else {
        var empty = {
            type: type.BLANK,
        } 
        return empty;
    }
    r >= 4 ? t = team.WHITE : t = team.BLACK;
    var piece = {
        type: p,
        team: t,
        letter: l,
        clear: function() {
            this.type = type.BLANK;
            this.team = undefined;
            this.letter = "";
        }
    };
    return piece;
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
