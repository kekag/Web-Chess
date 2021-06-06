/* PIECE MOVEMENT FUNCTIONS ASSUME THE PIECES ARE NOT PINNED */

function pawnMoves(pawn) {
    const possible = new Array();
    var start, d, c, r;
    if (pawn.piece.team == team.WHITE) {
        d = -1;
        start = 2;
    } else {
        d = 1;
        start = 7;
    }
    CR = getCR(pawn);
    c = CR[0]; r = CR[1];

    // Assume any possible move can be played then restrict
    var s = r+d;
    for (var i = -1; i <= 1; i++) {
        var t = c+i;
        if (t >= 0 && t < 8) { // in board boundaries
            if (c == t && board[t][s].piece.type == type.BLANK) { // opposite tile
                possible.push([t, s]);
                if (c == t && board[t][s+d].piece.type == type.BLANK && pawn.row == start) {
                    possible.push([t, s+d]);
                }
            } else if (c != t && (board[t][s].piece.type != type.BLANK && board[t][s].piece.team != pawn.piece.team) || // normal diagonal tile(s), including en passant (next line)
                                 (board[t][s].piece.type == type.BLANK && board[t][r].piece.type == type.PAWN && board[t][r].piece.team != pawn.piece.team && board[t][r].piece.case == true)) { 
                possible.push([t, s]);
            } 
        }
    }

    return possible;
}

function knightMoves(knight) {
    const possible = new Array();
    var c, r;
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
    const possible = new Array();
    var c, r;
    CR = getCR(bishop);
    c = CR[0]; r = CR[1];

    for (var i = 1; i <= c; i++) { // UPLEFT
        var t = c-i;
        var s = r-i;
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
    for (var i = 1; i <= c; i++) { // DOWNLEFT
        var t = c-i;
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
    for (var i = 1; i <= 8-c; i++) { // DOWNRIGHT
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
    for (i = 1; i <= 8-c; i++) { // UPRIGHT
        var t = c+i;
        var s = r-i;
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
    const possible = new Array();
    var c, r;
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
            possible.push([c, s]);
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
    const possible = new Array();
    var c, r;
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