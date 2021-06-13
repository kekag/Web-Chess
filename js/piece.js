/* PIECE MOVEMENT FUNCTIONS ASSUME THE PIECES ARE NOT PINNED */

function pawn() {
    const possible = new Array();
    var start, d;
    if (this.team == team.WHITE) {
        d = -1;
        start = 6;
    } else {
        d = 1;
        start = 1;
    }
    // Assume any possible move can be played then restrict
    var s = this.row+d;
    for (var i = -1; i <= 1; i++) {
        var t = this.col+i;
        if (t >= 0 && t < 8) { // in board boundaries
            if (c == t && board[t][s].type == type.BLANK) { // opposite tile
                possible.push([t, s]);
                if (s+d >= 0 && s+d < 8) {
                    if (c == t && board[t][s+d].type == type.BLANK && this.row == start) {
                        possible.push([t, s+d]);
                    }
                }
            } else if (c != t && (board[t][s].type != type.BLANK && board[t][s].team != this.team) || // normal diagonal tile(s), including en passant (next line)
                                    (board[t][s].type == type.BLANK && board[t][r].type == type.PAWN && board[t][r].team != this.team && board[t][r].case)) { 
                possible.push([t, s]);
            } 
        }
    }
    return possible;
}

function knight() {
    const possible = new Array();
    for (var i = -2; i <= 2; i++) {
        for (var j = -2; j <= 2; j++) {
            var t = this.col+i;
            var s = this.row+j;
            // L shaped movement — In boundaries — Not team's piece
            if (Math.abs(i)+Math.abs(j) == 3 && t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].team != this.team) {
                possible.push([t, s]);
            }
        }
    }
    return possible;
}

function bishop() {
    const possible = new Array();
    for (var i = 1; i <= this.col; i++) { // UPLEFT
        var t = this.col-i;
        var s = this.row-i;
        if (t < 0 || s < 0) break;
        if (board[t][s].type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].team != this.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (var i = 1; i <= this.col; i++) { // DOWNLEFT
        var t = this.col-i;
        var s = this.row+i;
        if (t < 0 || s >= 8) break;
        if (board[t][s].type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].team != this.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (var i = 1; i <= 8-this.col; i++) { // DOWNRIGHT
        var t = this.col+i;
        var s = this.row+i;
        if (t >= 8 || s >= 8) break;
        if (board[t][s].type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].team != this.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    for (i = 1; i <= 8-this.col; i++) { // UPRIGHT
        var t = this.col+i;
        var s = this.row-i;
        if (t >= 8 || s < 0) break;
        if (board[t][s].type == type.BLANK) {
            possible.push([t, s]);
        } else if (board[t][s].team != this.team) {
            possible.push([t, s]);
            break;
        } else {
            break;
        }
    }
    return possible;
}

function rook() {
    const possible = new Array();
    for (var i = -1; i >= -this.col; i--) { // LEFT
        var t = this.col+i;
        if (board[t][this.row].type == type.BLANK) {
            possible.push([t, this.row]);
        } else if (board[t][this.row].team != this.team) {
            possible.push([t, this.row]);
            break;
        } else {
            break;
        }
    }
    for (var i = 1; i < 8-this.col; i++) { // RIGHT
        var t = this.col+i;
        if (board[t][this.row].type == type.BLANK) {
            possible.push([t, this.row]);
        } else if (board[t][this.row].team != this.team) {
            possible.push([t, this.row]);
            break;
        } else {
            break;
        }
    }
    for (var j = -1; j >= -this.row; j--) { // UP
        var s = this.row+j;
        if (board[this.col][s].type == type.BLANK) {
            possible.push([this.col, s]);
        } else if (board[this.col][s].team != this.team) {
            possible.push([this.col, s]);
            break;
        } else {
            break;
        }
    }
    for (var j = 1; j < 8-this.row; j++) { // DOWN
        var s = this.row+j;
        if (board[this.col][s].type == type.BLANK) {
            possible.push([this.col, s]);
        } else if (board[this.col][s].team != this.team) {
            possible.push([this.col, s]);
            break;
        } else {
            break;
        }
    }
    return possible;
}

function queen() {
    var b = bishop();
    var r = rook();
    return b.concat(r);
}

function king() {
    const possible = new Array();
    // Normal one-tile movements
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            var t = this.col+i;
            var s = this.row+j;
            // L shaped movement — In boundaries — Not team's piece
            if (t >= 0 && t < 8 && s >= 0 && s < 8 && board[t][s].team != this.team) {
                possible.push([t, s]);
            }
        }
    }
    // Castling
    var rank;
    this.team == team.WHITE ? rank = 7 : rank = 0; 
    if (this.case && this.team == 4 && r == rank) {
        if (board[7][rank].type == type.ROOK && board[7][rank].case) { // King side
            var gap = true;
            for (var i = this.team+1; i < 7; i++) {
                if (board[i][rank].type != type.BLANK) {
                    gap = false;
                }
            }
            if (gap) possible.push([7, rank]);
        }
        if (board[0][rank].type == type.ROOK && board[0][rank].case) { // King side
            var gap = true;
            for (var i = this.team-1; i > 0; i--) {
                if (board[i][rank].type != type.BLANK) {
                    gap = false;
                }
            }
            if (gap) possible.push([0, rank]);
        }
    }
    return possible;
}