var active, possible;
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
    return undefined
}

function activatePiece(temp) {
    if (temp != undefined && temp.piece.type != type.BLANK && active != temp && temp.piece.team == turn) {
        if (possible != undefined) {
            var CR = getCR(temp);
            for (const p of possible) {
                if (p[0] == CR[0] && p[1] == CR[1]) {
                    return;
                }
            }
        }
        active = temp;
        switch(active.piece.type) {
            case type.PAWN:
                possible = pawnMoves(active);
                break;
            case type.KNIGHT:
                possible = knightMoves(active);
                break;
            case type.BISHOP:
                possible = bishopMoves(active);
                break;
            case type.ROOK:
                possible = rookMoves(active);
                break;
            case type.QUEEN:
                possible = queenMoves(active);
                break;
            case type.KING:
                possible = kingMoves(active);
                break;
        }
        move = undefined;
    }
}

// Copy active piece to new square then clear
function copyClear(temp, c, r, log) {
    var tp = temp.piece.type;
    var tm = temp.piece.team;
    var tc = temp.piece.case;
    board[c][r].piece.type = tp;
    board[c][r].piece.team = tm;
    board[c][r].piece.case = tc;
    temp.piece.clear();
    if (log) {
        console.log(`${tm}${tp} ${temp.col}${temp.row}→${board[c][r].col}${board[c][r].row}`);
    }
}

function movePiece(move) {    
    if (move != undefined && possible != undefined && active != move) { 
        var MCR = getCR(move);
        var ACR = getCR(active);
        for (const p of possible) {
            if (p[0] == MCR[0] && p[1] == MCR[1]) {
                drag = false;
                var standard = true;

                // Update case status and handle special cases
                if (active.piece.case != undefined) {
                    switch(active.piece.type) {
                        case type.PAWN:
                            var d, l, r; // direction, left condition and right condition
                            turn == team.WHITE ? d = -1 : d = 1;
                            l = r = false;
                            if (ACR[0]-1 >= 0) l = board[ACR[0]-1][MCR[1]].piece.type == type.PAWN;
                            if (ACR[0]+1 < 8) r = board[ACR[0]+1][MCR[1]].piece.type == type.PAWN;
                            if (MCR[1]-ACR[1] == (d*2) && (l || r)) {
                                active.piece.case = true;
                            } else { // turn back false in case the condition was met before but no longer does
                                active.piece.case = false;
                            }

                            if (board[MCR[0]][MCR[1]].piece.type == type.BLANK && ACR[0] != MCR[0]) { // en passant capture
                                board[MCR[0]][MCR[1]-d].piece.clear();
                            }
                            break;
                        case type.ROOK:
                            active.piece.case = false;
                            break;
                        case type.KING:
                            if (active.piece.case) { // castling
                                var rank;
                                turn == team.WHITE ? rank = 7 : rank = 0;
                                if (MCR[0] == 7) { // king side
                                    copyClear(active, 6, rank, false);
                                    copyClear(board[7][rank], 5, rank, false);
                                    console.log(`${turn} O-O`);
                                    standard = false;
                                } else if (MCR[0] == 0) { // queen side
                                    copyClear(active, 2, rank, false);
                                    copyClear(board[0][rank], 3, rank, false);
                                    console.log(`${turn} O-O-O`);
                                    standard = false;
                                }
                            }
                            active.piece.case = false;
                            break;
                    }
                }
                
                if (standard) copyClear(active, MCR[0], MCR[1], true);
                
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
    temp = getSquare(e);
    activatePiece(temp);
    movePiece(temp);
});
  
document.addEventListener('mousemove', e => {
    if (down && getSquare(e) == active) {
        drag = true;
        setPosition(e);
    }
});