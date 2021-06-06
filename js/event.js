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

function movePiece(move) {    
    if (move != undefined && active != move) { 
        var MCR = getCR(move);
        var ACR = getCR(active);
        for (const p of possible) {
            if (p[0] == MCR[0] && p[1] == MCR[1]) {
                drag = false;

                // Handle special cases
                if (active.piece.case != undefined) {
                    switch(active.piece.type) {
                        case type.PAWN:
                            var d, l, r; // direction, left condition and right condition
                            turn == team.WHITE ? d = -2 : d = 2;
                            l = r = false;
                            if (ACR[0]-1 >= 0) {
                                l = board[ACR[0]-1][MCR[1]].piece.type == type.PAWN;
                                console.log(l);
                            }
                            if (ACR[0]+1 < 8) {
                                r = board[ACR[0]+1][MCR[1]].piece.type == type.PAWN;
                                console.log(r);
                            }
                            if (MCR[1]-ACR[1] == d && (l || r)) {
                                console.log("TRUEE");
                                active.piece.case = true;
                            } else { // turn back false in case the condition was met before but no longer does
                                active.piece.case = false;
                            }
                            break;
                        case type.ROOK:
                            active.piece.case = false;
                            break;
                        case type.KING:
                            active.piece.case = false;
                            break;
                    }
                }

                // Copy active piece to new square then clear
                var tp = active.piece.type;
                var tm = active.piece.team;
                var tc = active.piece.case;
                board[MCR[0]][MCR[1]].piece.type = tp;
                board[MCR[0]][MCR[1]].piece.team = tm;
                board[MCR[0]][MCR[1]].piece.case = tc;
                console.log(`${tm}${tp} ${active.col}${active.row}→${board[MCR[0]][MCR[1]].col}${board[MCR[0]][MCR[1]].row}`);
                active.piece.clear();


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