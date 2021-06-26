//
/* Piece logic */
// 

// Threats should be irrespective of piece/team and not account for pins/checks, moves however should
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
    var t, s;
    t = this.col;
    s = this.row + this.team.dir;
    for (const p of this.threats()) {
        if ((board[p[0]][p[1]].piece != piece.BLANK && board[p[0]][p[1]].team != this.team) || (board[p[0]][p[1]].piece == piece.BLANK && board[p[0]][this.row].case)) {
            moves.push(p);
        }
    }
    if (board[t][s].piece == piece.BLANK) {
        moves.push([t, s]);
        if (this.row == this.team.rank[1] && board[t][s + this.team.dir].piece == piece.BLANK) {
            moves.push([t, s + this.team.dir]);
        }
    }
    return moves;
}

function knightThreats() {
    const threats = new Array();
    var i, j, t, s;
    for (i = -2; i <= 2; i++) {
        for (j = -2; j <= 2; j++) {
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
    return this.threats();
}

function bishopThreats() {
    const threats = new Array();
    var i, j, t, s, edge;
    for (i = 0; i < 4; i++) {
        i < 2 ? edge = this.col : edge = 8 - this.col;
        for (j = 1; j <= edge; j++) {
            i < 2 ? t = this.col - j : t = this.col + j;
            i == 1 || i == 2 ? s = this.row + j : s = this.row - j;
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                threats.push([t, s]);
            } else if (board[t][s].team != this.team) {
                threats.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return threats;
}

function bishopMoves() {
    return this.threats();
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
    return this.threats();
}

function queenThreats() {
    const threats = new Array();
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
                i == 5 || i == 6 ? s = this.row + j : s = this.row - j;
            }
            if (t < 0 || s < 0 || t >= 8 || s >= 8) break;
            if (board[t][s].piece == piece.BLANK) {
                threats.push([t, s]);
            } else if (board[t][s].team != this.team) {
                threats.push([t, s]);
                break;
            } else {
                break;
            }
        }
    }
    return threats;
}

function queenMoves() {
    return this.threats();
}

function kingThreats() {
    const threats = new Array();
    var i, j, t, s;
    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            t = this.col+i;
            s = this.row+j;
            if (t >= 0 && t < 8 && s >= 0 && s < 8) {
                threats.push([t, s]);
            }
        }
    }
    return threats;
}

function kingMoves() {
    const moves = new Array();
    for (const p of this.threats()) {
        if (board[p[0]][p[1]].team != this.team) {
            moves.push(p);
        }
    }
    var r = this.team.rank[0]; // Castling
    if (this.case && this.col == 4 && this.row == r) {
        if (board[7][r].piece == piece.ROOK && board[7][r].case) { // King side
            var gap = true;
            for (var i = this.col + 1; i < 7; i++) {
                if (board[i][r].piece != piece.BLANK) {
                    gap = false;
                }
            }
            if (gap) moves.push([7, r]);
        }
        if (board[0][r].piece == piece.ROOK && board[0][r].case) { // Queen side
            var gap = true;
            for (var i = this.col - 1; i > 0; i--) {
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

var canvas = document.getElementById("canvas");
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
Object.freeze(piece);
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
// column first, row second, e.g.
// [0][0] → a8, [7][0] → h8
// [0][7] → a1, [7][7] → h1
for (var c = 0; c < 8; c++) {
    for (var r = 0; r < 8; r++) {
        // Determine starting position for respective [c][r] square
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
                special = true; // if moved make false, castling no longer possible for rook's side
            } else if (c == 1 || c == 6) {
                p = piece.KNIGHT;
            } else if (c == 2 || c == 5) {
                p = piece.BISHOP;
            } else if (c == 3) {
                p = piece.QUEEN;
            } else { // c == 4
                p = piece.KING;
                special = true; // if moved make false, castling no longer possible
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
ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
ctx.stroke();
ctx.closePath();

//
/* Manage mouse events and moves */
//

var audio = new Audio("audio/move.wav");
audio.volume = 0.225;
var active, promotion;
var down, drag, pos;

function setPosition(e) {
    // (x, y) position relative to canvas
    pos = [e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop];
}

function getSquare(e) {
    setPosition(e)
    if (pos[0] >= 0 && pos[1] >= 0 && pos[0] < canvas.width && pos[1] < canvas.height) {
        return board[Math.floor(pos[0]/s)][Math.floor(pos[1]/s)];
    }
    return undefined;
}

function deactivate() {
    active = undefined;
    possible = [];
}

function copyClear(temp, c, r, log) {
    board[c][r] = Object.assign({}, temp);
    board[c][r].col = c;
    board[c][r].row = r;
    temp.clear();
    if (log) {
        console.log(`${board[c][r].team.value}${board[c][r].piece.value} ${cols[temp.col]}${rows[temp.row]} ${cols[board[c][r].col]}${rows[board[c][r].row]}`);
    }
}

function endTurn() {
    audio.play();
    turn == team.WHITE ? turn = team.BLACK : turn = team.WHITE;
}

function activatePiece(temp) {
    if (temp.piece != piece.BLANK && active != temp && temp.team == turn) {
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
    if (active != temp && active != undefined) { 
        for (const m of active.moves()) {
            if (m[0] == temp.col && m[1] == temp.row) {
                drag = false;
                var standard = true;
                // Update case status and handle special cases
                if (active.case != undefined) {
                    switch(active.piece) {
                        case piece.PAWN:
                            var l, r = false;
                            if (active.col - 1 >= 0) {
                                l = board[active.col - 1][temp.row].piece == piece.PAWN;
                            }
                            if (active.col + 1 < 8) {
                                r = board[active.col + 1][temp.row].piece == piece.PAWN;
                            }
                            if (temp.row-active.row == (turn.dir * 2) && (l || r)) {
                                active.case = true;
                            } else { // condition was met before but no longer should
                                active.case = false;
                            }
                            if (board[temp.col][temp.row].piece == piece.BLANK && active.col != temp.col) { // en passant capture
                                board[temp.col][temp.row - turn.dir].clear();
                            } else if (temp.row == turn.rank[7]) { // pawn promotion
                                promotion = board[temp.col][temp.row];
                                active.clear();
                                deactivate();
                                return;
                            }
                            break;
                        case piece.ROOK:
                            active.case = false;
                            break;
                        case piece.KING:
                            if (active.case) { // castling
                                if (temp.col == 7) { // king side
                                    console.log("tee");
                                    copyClear(active, 6, temp.team.rank[0], false);
                                    copyClear(board[7][temp.team.rank[0]], 5, temp.team.rank[0], false);
                                    console.log(`${turn} O-O`);
                                    endTurn();
                                    return;
                                } else if (temp.col == 0) { // queen side
                                    console.log("tee");
                                    copyClear(active, 2, temp.team.rank[0], false);
                                    copyClear(board[0][temp.team.rank[0]], 3, temp.team.rank[0], false);
                                    console.log(`${turn} O-O-O`);
                                    endTurn();
                                    return;
                                }
                            }
                            active.case = false;
                            break;
                    }
                }
                
                copyClear(active, temp.col, temp.row, true);
                endTurn();
                break;
            }
        }
        if (!drag) { // Keep drag/drop piece activated
            deactivate();
        }
    }
}

document.addEventListener("click", e => {
    down = false;
    if (drag && active != undefined) { // Dropped drag
        temp = getSquare(e);
        if (temp != undefined) {
            movePiece(temp);
        }
        drag = false;
    } 
});

document.addEventListener('mousedown', e => {
    down = true;
    temp = getSquare(e);
    if (temp != undefined) {
        activatePiece(temp);
        movePiece(temp);
    } else {
        deactivate();
    }
});
  
document.addEventListener('mousemove', e => {
    if (down && active != undefined && getSquare(e) == active) {
        drag = true;
        setPosition(e);
    }
});

//
/* Render board and pieces */
//

var background = document.getElementById("board");
var bgctx = background.getContext("2d");

// Draw individual squares
bgctx.font = `${s/6}px sans-serif`;
var [light, dark] = ["#B9B9B9", "#3D3D3D"];
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
        bgctx.beginPath();
        bgctx.rect(c*s, r*s, s, s);
        bgctx.fillStyle = squareColor;
        bgctx.fill();
        bgctx.closePath();

        // Draw column and row letters and digits
        bgctx.strokeStyle = textColor;
        if (r == 7) {
            bgctx.strokeText(cols[board[c][r].col].toUpperCase(), c*s + s - s/6, r*s + 86);
        }
        if (c == 0) {
            bgctx.strokeText(rows[board[c][r].row], c*s + 4, r*s + s/6);
        }
    }
}

function highlightSquare(c, r, glow, color) {
    var alpha = 0.70;
    var fade;
    for (var i = 1; i < s/2; i++) { 
        fade = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        bgctx.beginPath();
        bgctx.rect(c*s+i, r*s+i, s-i*2, s-i*2);
        bgctx.strokeStyle = fade;
        bgctx.stroke();
        bgctx.closePath();
        alpha -= glow;
    }
}

function drawPiece(c, r) {
    if (board[c][r].piece == piece.BLANK) return;
    
    var img = new Image(s, s);
    img.src = `graphics/${board[c][r].team.value}${board[c][r].piece.value}.svg`

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

var rehighlight, redraw = true;
var ac, ar;

function display() {
    if (active != undefined && rehighlight) {
        highlightSquare(active.col, active.row, 0.015, [255, 255, 255]);
        for (const m of active.moves()) {
            highlightSquare(m[0], m[1], 0.015, [18, 246, 146]);
        }
        ac = active.col;
        ar = active.row;
        console.log("rehighlighted");
        rehighlight = false;
    }
    if (!drag || redraw) {
        for (var c = 0; c < 8; c++) {
            for (var r = 0; r < 8; r++) {
                if (c != ac || r != ar) {
                    drawPiece(c, r);
                }
            }
        }
        console.log("redrawed");
        redraw = false;
    }
    if (active != undefined) { 
        console.log(ac, ar);
        drawPiece(ac, ar);
    }
}

setInterval(display, 500);