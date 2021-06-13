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
        console.log(`${temp.team}${temp.type} ${cols[temp.col]}${rows[temp.row]}→${cols[board[c][r].col]}${rows[board[c][r].row]}`);
    }
}

function activatePiece(temp) {
    if (temp != undefined && temp.type != type.BLANK && active != temp && temp.team == turn) {
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
    if (temp != undefined && temp.moves() != undefined && active != temp) { 
        for (const m of temp.moves()) {
            if (m[0] == temp.col && m[1] == temp.row) {
                drag = false;
                var standard = true;

                // Update case status and handle special cases
                if (active.case != undefined) {
                    switch(active.type) {
                        case type.PAWN:
                            var d, l, r; // direction, left condition and right condition
                            turn == team.WHITE ? d = -1 : d = 1;
                
                            l = r = false;
                            if (active.col-1 >= 0) l = board[active.col-1][temp.row].type == type.PAWN;
                            if (active.col+1 < 8) r = board[active.col+1][temp.row].type == type.PAWN;
                            if (temp.row-active.row == (d*2) && (l || r)) {
                                active.case = true;
                            } else { // turn back false in case the condition was met before but no longer does
                                active.case = false;
                            }
                            if (board[temp.col][temp.row].type == type.BLANK && active.col != temp.col) { // en passant capture
                                board[temp.col][temp.row-d].clear();
                            } else if (temp.row == oponentRank) { // pawn promotion
                                promotion = board[temp.col][temp.row];
                                active.clear();
                                active = undefined;
                                possible = [];
                                return;
                            }
                            break;
                        case type.ROOK:
                            active.case = false;
                            break;
                        case type.KING:
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