var canvas = document.getElementById("boardCanvas");
var ctx = canvas.getContext("2d");
var s = canvas.width / 8;

// Define piece enums
const type = {
    PAWN:   "P",
    KNIGHT: "N",
    BISHOP: "B",
    ROOK:   "R",
    QUEEN:  "Q",
    KING:   "K",
    BLANK:  "",
}
Object.freeze(type);

const team = {
    WHITE: {
        value: "w",
        rank: new Array(8),
    }, 
    BLACK: {
        value: "b",
        rank: new Array(8),
    }, 
}

// Use cols/rows as a map/dictionary
var cols = {};
var rows = {}; 
for(let i = 0; i < 8; i++) {
    cols[i] = String.fromCharCode(97 + i);
    rows[i] = -(i - 8);
    team.WHITE.rank[i] = -(i - 7);
    team.BLACK.rank[i] = i;
}
Object.freeze(team);

var turn = team.WHITE;

// Create board as 2D-arrary
const board = new Array(8);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
}

// INITIALIZE PIECES AND BOARD
// column first, row second e.g.
// [0][0] → a8 [7][0] → h8
// [0][7] → a1 [7][7] → h1
for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 8; r++) {
        // Determine starting position for specific [c][r] square
        var p, t, m, special;
        if (r > 5) {
            t = team.WHITE;
        } else if (r < 2) {
            t = team.BLACK;
        }
        if (r == 1 || r == 6) { // Minor pieces (second rank)
            p = type.PAWN;
            special = false; // iff moved to 4th rank in one move make true, en passant applies
        } else if (r == 0 || r == 7) { // Major pieces (first rank)
            if (c == 0 || c == 7) {
                p = type.ROOK;
                special = true; // if moved make false, castling no longer possible for either queen/king side
            } else if (c == 1 || c == 6) {
                p = type.KNIGHT;
            } else if (c == 2 || c == 5) {
                p = type.BISHOP;
            } else if (c == 3) {
                p = type.QUEEN;
            } else { // c == 4
                p = type.KING;
                special = true; // if moved make false, castling no longer possible for either side
            }
        } else {
            p = type.BLANK;
        }

        switch(p) {
            case type.PAWN:
                m = pawn;
                break;
            case type.KNIGHT:
                m = knight;
                break;
            case type.BISHOP:
                m = bishop;
                break;
            case type.ROOK:
                m = rook;
                break;
            case type.QUEEN:
                m = queen;
                break;
            case type.KING:
                m = king;
                break;
        }
        
        var piece = {
            type: p,
            team: t,
            col: c,
            row: r,
            case: special,
            moves: m,
            clear: function() {
                this.type = type.BLANK;
                this.team = undefined;
            }
        };

        board[c][r] = piece;
    }
}

// Draw border around board
ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "rgba(255, 255, 255, 0.53595)";
ctx.stroke();
ctx.closePath();