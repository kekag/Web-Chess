var active, move;
var down, drag;
var possible;
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
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        var c = Math.floor(x / s);
        var r = Math.floor(y / s);
        return board[c][r];
    }
    return undefined
}

function copyPiece(c, r) {
    var tp = active.piece.type;
    var tm = active.piece.team;
    board[c][r].piece.type = tp;
    board[c][r].piece.team = tm;
    console.log(`${tm}${tp} ${active.col}${active.row}→${board[c][r].col}${board[c][r].row}`);
    active.piece.clear();
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

function movePiece(temp) {    
    if (temp != undefined && active != temp) { 
        var CR = getCR(temp);
        for (const p of possible) {
            if (p[0] == CR[0] && p[1] == CR[1]) {
                drag = false;
                move = temp;
                copyPiece(CR[0], CR[1]);
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