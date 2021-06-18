//
/* Piece logic */
// 

// Threats should be irrespective of team and not account for pins/checks, moves should
function pawnThreats() {
    const threats = new Array();
    if (this.col - 1 >= 0) {
        threats.push([this.col - 1, this.row + this.team.dir]);
    }
    if (this.col + 1 < 8) {
        threats.push([this.col + 1, this.row + this.team.dir]);
    }
    return threats;
}

function pawnMoves() {
    const moves = new Array();
    var s = this.row + this.team.dir;
    for (var i = -1; i <= 1; i++) {
        var t = this.col + i;
        if (t >= 0 && t < 8) { // in board boundaries
            if (this.col == t && board[t][s].piece == piece.BLANK) { // opposite tile
                moves.push([t, s]);
                if (s+this.team.dir >= 0 && s+this.team.dir < 8) {
                    if (this.col == t && board[t][s+this.team.dir].piece == piece.BLANK && this.row == this.team.rank[1]) {
                        moves.push([t, s+this.team.dir]);
                    }
                }
            } else if (this.col != t && (board[t][s].piece != piece.BLANK && board[t][s].team != this.team) || // normal diagonal tile(s), including en passant (next line)
                                 (board[t][s].piece == piece.BLANK && board[t][this.row].piece == piece.PAWN && board[t][this.row].team != this.team && board[t][this.row].case)) { 
                moves.push([t, s]);
            } 
        }
    }
    return moves;
}

function knightThreats() {
    const threats = new Array();
    var t, s;
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            t = this.col+i;
            s = this.row+j;
            if (Math.abs(i)+Math.abs(j) == 3 && t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].team != this.team) {
                threats.push([t, s]);
            }
        }
    }
    return threats;
}

function knightMoves() {
    const moves = new Array();
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            var t = this.col+i;
            var s = this.row+j;
            if (Math.abs(i)+Math.abs(j) == 3 && t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].team != this.team) {
                moves.push([t, s]);
            }
        }
    }
    return moves;
}

function bishopThreats() {
    const moves = new Array();
    var i, j, t, s, edge;
    for (i = 0; i < 4; i++) {
        i < 2 ? edge = this.col : edge = 8 - this.col;
        for (j = 1; j <= edge; j++) {
            i < 2 ? t = this.col - j : t = this.col + j;
            i == 1 || i == 2 ? s = this.row + j : s = this.row - j;
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return moves;
}

function bishopMoves() {
    const moves = new Array();
    var i, j, t, s, edge;
    for (i = 0; i < 4; i++) {
        i < 2 ? edge = this.col : edge = 8 - this.col;
        for (j = 1; j <= edge; j++) {
            i < 2 ? t = this.col - j : t = this.col + j;
            i == 1 || i == 2 ? s = this.row + j : s = this.row - j;
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return moves;
}

function rookThreats() {
    const threats = new Array();
    var i, j, t, s, edge;
    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            i < 2 ? edge = this.col + 1 : edge = 8 - this.col;
        } else {
            i < 2 ? edge = this.row + 1 : edge = 8 - this.row;
        }
        for (var j = 1; j < edge; j++) {
            if (i % 2 == 0) {
                i < 2 ? t = this.col - j : t = this.col + j;
                s = this.row
            } else {
                t = this.col;
                i < 2 ? s = this.row - j : s = this.row + j;
            }
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return threats;
}

function rookMoves() {
    const moves = new Array();
    var i, j, t, s, edge;
    for (var i = 0; i < 4; i++) {
        if (i % 2 == 0) {
            i < 2 ? edge = this.col + 1 : edge = 8 - this.col;
        } else {
            i < 2 ? edge = this.row + 1 : edge = 8 - this.row;
        }
        for (var j = 1; j < edge; j++) {
            if (i % 2 == 0) {
                i < 2 ? t = this.col - j : t = this.col + j;
                s = this.row
            } else {
                t = this.col;
                i < 2 ? s = this.row - j : s = this.row + j;
            }
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return moves;
}

function queenThreats() {
    const moves = new Array();
    var i, j, t, s, edge;
    for (var i = 0; i < 8; i++) {
        if (i < 4) {
            if (i % 2 == 0) {
                i < 2 ? edge = this.col + 1 : edge = 8 - this.col;
            } else {
                i < 2 ? edge = this.row + 1 : edge = 8 - this.row;
            }
        } else {
            i < 2 ? edge = this.col + 1 : edge = 8 - this.col + 1;
        }
        for (var j = 1; j < edge; j++) {
            if (i < 4) {
                if (i % 2 == 0) {
                    i < 2 ? t = this.col - j : t = this.col + j;
                    s = this.row
                } else {
                    t = this.col;
                    i < 2 ? s = this.row - j : s = this.row + j;
                }
            } else {
                i < 2 ? t = this.col-j : t = this.col+j;
                i == 1 || i == 2 ? s = this.row+j : s = this.row-j;
            }
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return moves;
}

function queenMoves() {
    const moves = new Array();
    var i, j, t, s, edge;
    for (var i = 0; i < 8; i++) {
        if (i < 4) {
            if (i % 2 == 0) {
                i < 2 ? edge = this.col + 1 : edge = 8 - this.col;
            } else {
                i < 2 ? edge = this.row + 1 : edge = 8 - this.row;
            }
        } else {
            i < 6 ? edge = this.col + 1 : edge = 8 - this.col + 1;
        }
        for (var j = 1; j < edge; j++) {
            if (i < 4) {
                if (i % 2 == 0) {
                    i < 2 ? t = this.col - j : t = this.col + j;
                    s = this.row
                } else {
                    t = this.col;
                    i < 2 ? s = this.row - j : s = this.row + j;
                }
            } else {
                i < 6 ? t = this.col - j : t = this.col + j;
                i == 6 || i == 7 ? s = this.row + j : s = this.row - j;
            }
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                moves.push([t, s]);
            } else if (board[t][s].team != this.team) {
                moves.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return moves;
}

function kingThreats() {
    const threats = new Array();
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var t = this.col+i;
            var s = this.row+j;
            if (t >= 0 && t < 8 && s >= 0 && s < 8) {
                threats.push([t, s]);
            }
        }
    }
    return threats;
}

function kingMoves() {
    const moves = new Array();
    // Normal one-tile movements
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var t = this.col+i;
            var s = this.row+j;
            // In boundaries — Not team's piece
            if (t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].team != this.team) {
                moves.push([t, s]);
            }
        }
    }
    // Castling
    var r = this.team.rank[0];
    if (this.case && this.team == 4 && this.row == r) {
        if (board[7][r].piece == piece.ROOK && board[7][r].case) { // King side
            var gap = true;
            for (var i = this.col+1; i < 7; i++) {
                if (board[i][r].piece != piece.BLANK) {
                    gap = false;
                }
            }
            if (gap) moves.push([7, r]);
        }
        if (board[0][r].piece == piece.ROOK && board[0][r].case) { // Queen side
            var gap = true;
            for (var i = this.col-1; i > 0; i--) {
                if (board[i][r].piece != piece.BLANK) {
                    gap = false;
                }
            }
            if (gap) moves.push([0, r]);
        }
    }
    return moves;
}

//
/* Initialize canvas and board variables */
//

var canvas = document.getElementById("boardCanvas");
var ctx = canvas.getContext("2d");
var s = canvas.width / 8;

// Define piece enumerations
// *The aliased functions are EXCLUSIVELY used in the context Square object, I'm only defining it here to avoid needing a switch statement later
const piece = {
    PAWN: {
        value: "P",
        threats: pawnThreats,
        moves: pawnMoves
    },
    KNIGHT: {
        value: "N",
        threats: knightThreats,
        moves: knightMoves
    },
    BISHOP: {
        value: "B",
        threats: bishopThreats,
        moves: bishopMoves
    },
    ROOK:   {
        value: "R",
        threats: rookThreats,
        moves: rookMoves
    },
    QUEEN:  {
        value: "Q",
        threats: queenThreats,
        moves: queenMoves
    },
    KING:   {
        value: "K",
        threats: kingThreats,
        moves: kingMoves
    },
    BLANK:  "",
}
Object.freeze(piece);

const team = {
    WHITE: {
        value: "w",
        rank: new Array(8),
        dir: -1
    }, 
    BLACK: {
        value: "b",
        rank: new Array(8),
        dir: 1
    }
}

// Use cols/rows as a map/dictionary, fill out ranks
const cols = {};
const rows = {}; 
for (let i = 0; i < 8; i++) {
    cols[i] = String.fromCharCode(97 + i);
    rows[i] = -(i - 8);
    team.WHITE.rank[i] = -(i - 7);
    team.BLACK.rank[i] = i;
}
Object.freeze(cols);
Object.freeze(rows);
Object.freeze(team);

var turn = team.WHITE;

// Create board as 2D-arrary
const board = new Array(8);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(8);
}


function Square(piece, team, col, row, special) {
    this.piece = piece;
    this.team = team;
    this.col = col;
    this.row = row;
    this.case = special;
    this.threats = piece.threats;
    this.moves = piece.moves;
    this.clear = function() {
        this.piece = "";
        this.team = undefined;
        this.case = undefined;
        this.threats = undefined;
        this.moves = undefined;
    }
} 

// INITIALIZE PIECES AND BOARD
// column first, row second e.g.
// [0][0] → a8, [7][0] → h8
// [0][7] → a1, [7][7] → h1
for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 8; r++) {
        // Determine starting position for specific [c][r] square
        var p, t, u, special;
        if (r > 5) {
            t = team.WHITE;
        } else if (r < 2) {
            t = team.BLACK;
        }
        if (r == 1 || r == 6) { // Minor pieces (second rank)
            p = piece.PAWN;
            special = false; // iff moved to 4th rank in one move make true, en passant applies
        } else if (r == 0 || r == 7) { // Major pieces (first rank)
            if (c == 0 || c == 7) {
                p = piece.ROOK;
                special = true; // if moved make false, castling no longer possible for either queen/king side
            } else if (c == 1 || c == 6) {
                p = piece.KNIGHT;
            } else if (c == 2 || c == 5) {
                p = piece.BISHOP;
            } else if (c == 3) {
                p = piece.QUEEN;
            } else { // c == 4
                p = piece.KING;
                special = true; // if moved make false, castling no longer possible for either side
            }
        } else {
            p = piece.BLANK;
            t = undefined;
            special = undefined;
        }

        var square = new Square(p, t, c, r, special);
        board[c][r] = square;
    }
}

// Draw border around board
ctx.beginPath();
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "rgba(255, 255, 255, 0.53595)";
ctx.stroke();
ctx.closePath();

//
/* Manage mouse events and moves */
//

var volume = 0.225;
var active, promotion;
var down, drag, pos;

function setPosition(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    pos = [x, y];
}

function getSquare(e) {
    setPosition(e)
    var x = pos[0];
    var y = pos[1];
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        var c = Math.floor(x / s);
        var r = Math.floor(y / s);
        return board[c][r];
    }
    return undefined;
}

// Copy active piece to new square then clear
function copyClear(temp, c, r, log) {
    board[c][r] = Object.assign({}, temp);
    board[c][r].col = c;
    board[c][r].row = r;
    temp.clear();
    if (log) {
        console.log(`${board[c][r].team.value}${board[c][r].piece.value} ${cols[temp.col]}${rows[temp.row]}→${cols[board[c][r].col]}${rows[board[c][r].row]}`);
    }
}

function activatePiece(temp) {
    if (temp != undefined && temp.piece != piece.BLANK && active != temp && temp.team == turn) {
        if (temp.moves() != undefined) {
            for (const m of temp.moves()) {
                if (m[0] == temp.col && m[1] == temp.row) {
                    return;
                }
            }
        }
        active = temp;
    }
}

function movePiece(temp) {
    if (active != temp && temp != undefined && active != undefined) { 
        for (const m of active.moves()) {
            if (m[0] == temp.col && m[1] == temp.row) {
                drag = false;
                var standard = true;

                // Update case status and handle special cases
                if (active.case != undefined) {
                    switch(active.piece) {
                        case piece.PAWN:
                            var l, r = false;
                            if (active.col-1 >= 0) {
                                l = board[active.col-1][temp.row].piece == piece.PAWN;
                            }
                            if (active.col+1 < 8) {
                                r = board[active.col+1][temp.row].piece == piece.PAWN;
                            }
                            if (temp.row-active.row == (turn.dir*2) && (l || r)) {
                                active.case = true;
                            } else { // turn back false in case the condition was met before but no longer does
                                active.case = false;
                            }
                            if (board[temp.col][temp.row].piece == piece.BLANK && active.col != temp.col) { // en passant capture
                                board[temp.col][temp.row-turn.dir].clear();
                            } else if (temp.row == turn.rank[7]) { // pawn promotion
                                promotion = board[temp.col][temp.row];
                                active.clear();
                                active = undefined;
                                possible = [];
                                return;
                            }
                            break;
                        case piece.ROOK:
                            active.case = false;
                            break;
                        case piece.KING:
                            if (active.case) { // castling
                                if (temp.col == 7) { // king side
                                    copyClear(active, 6, temp.team.rank[0], false);
                                    copyClear(board[7][temp.team.rank[0]], 5, temp.team.rank[0], false);
                                    console.log(`${turn} O-O`);
                                    standard = false;
                                } else if (temp.col == 0) { // queen side
                                    copyClear(active, 2, temp.team.rank[0], false);
                                    copyClear(board[0][temp.team.rank[0]], 3, temp.team.rank[0], false);
                                    console.log(`${turn} O-O-O`);
                                    standard = false;
                                }
                            }
                            active.case = false;
                            break;
                    }
                }
                
                if (standard) copyClear(active, temp.col, temp.row, true);
                var audio = new Audio("audio/move.wav");
                audio.volume = volume;
                audio.play();

                turn == team.WHITE ? turn = team.BLACK : turn = team.WHITE;                
                break;
            }
        }
        if (!drag) { // Keep drag/drop piece activated
            active = undefined;
            possible = [];
        }
    }
}

document.addEventListener("click", e => {
    down = false;
    if (drag && active != undefined) { // Dropped drag
        temp = getSquare(e);
        movePiece(temp);
        drag = false;
    } 
});

document.addEventListener('mousedown', e => {
    down = true;
    if (promotion != undefined) {
        //
    } else {
        temp = getSquare(e);
        activatePiece(temp);
        movePiece(temp);
    }
});
  
document.addEventListener('mousemove', e => {
    if (down && getSquare(e) == active) {
        drag = true;
        setPosition(e);
    }
});

//
/* Render board and pieces */
//

// Draw individual squares
function drawSquare() {
    ctx.font = `${s/6}px sans-serif`;
    var [dark, light] = ["#C0C0C0", "#525252"];
    var squareColor, textColor;
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (c % 2 == 0) {
                r % 2 == 0 ? squareColor = light : squareColor = dark;
            } else {
                r % 2 == 0 ? squareColor = dark : squareColor = light;
            }
            squareColor == light ? textColor = dark : textColor = light;

            // Draw filled tile
            ctx.beginPath();
            ctx.rect(c*s, r*s, s, s);
            ctx.fillStyle = squareColor;
            ctx.fill();
            ctx.closePath();

            // Draw column and row letters and digits
            ctx.strokeStyle = textColor;
            if (r == 7) {
                ctx.strokeText(cols[board[c][r].col].toUpperCase(), c*s + s - s/6, r*s + 86);
            }
            if (c == 0) {
                ctx.strokeText(rows[board[c][r].row], c*s + 4, r*s + s/6);
            }
        }
    }
}

function highlightSquare(c, r, glow, color) {
    var alpha = 0.7;
    var fade;
    for (var i = 1; i < s/2; i++) { 
        fade = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.rect(c*s+i, r*s+i, s-i*2, s-i*2);
        ctx.strokeStyle = fade;
        ctx.stroke();
        ctx.closePath();
        alpha -= glow;
    }
}

function drawPiece(c, r) {
    if (board[c][r].piece == piece.BLANK) return;
    
    var img = new Image(s, s);
    img.src = `sprites/${board[c][r].team.value}${board[c][r].piece.value}.svg`

    var x, y;
    if (drag && board[c][r] == active) {
        x = pos[0] - s/2;
        y = pos[1] - s/2;
    } else {
        x = c*s;
        y = r*s;
    }
    ctx.drawImage(img, x, y, s, s);
}

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // No easy way to draw board once, save the state and restore after each refresh, so this will work but isn't a solution I like
    drawSquare();
    var ac, ar;
    if (active != undefined) {
        highlightSquare(active.col, active.row, 0.015, [255, 255, 255]);
        for (const m of active.moves()) {
            highlightSquare(m[0], m[1], 0.015, [18, 246, 146]);
        }
        ac = active.col;
        ar = active.row;
    }
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (c != ac || r != ar) {
                drawPiece(c, r);
            }
        }
    }
    if (active != undefined) drawPiece(ac, ar);
}

setInterval(display, 200);