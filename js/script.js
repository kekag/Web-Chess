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
    if (x >= 0 && x <= 720 && y >= 0 && y <= 720) {
        var c = Math.floor(x / s);
        var r = Math.floor(y / s);
        return board[c][r];
    }
    return undefined
}

function activatePiece(temp) {
    if (active == temp) return;
    active = temp;
    if (active != undefined && active.piece.type != type.BLANK) {
        console.log(`ACTIVATE col: ${active.col}, row: ${active.row}`);
    }
    move = undefined;
}

function movePiece(temp) {
    if (active == temp || move == temp) return;
    if (active == undefined) {
        active = temp;
    }
    move = temp;
    // if (move != undefined && active.piece.type != type.BLANK) {
        console.log(`MOVE col: ${move.col}, row: ${move.row}`);
    // }
    var ACR = getCR(active);
    var MCR = getCR(move); 
    board[MCR[0]][MCR[1]].piece = active.piece;
    board[ACR[0]][ACR[1]].piece.clear();
}

document.addEventListener("click", e => {
    down = false;
    if (active == undefined) return;
    if (drag) { // Dropped from drag
        drag = false;
        temp = getSquare(e);
        movePiece(temp);
    } else { // Clicking after piece is highlighted

    }
});

document.addEventListener('mousedown', e => {
    down = true;
    temp = getSquare(e);
    activatePiece(temp);
    movePiece(temp);
});
  
document.addEventListener('mousemove', e => {
    if (down) {
        drag = true;
        setPosition(e);
    }
});

function drawSquare(c, r, highlight) {
    var squareColor, textColor;
    var dark, light, fade;
    var light = "#C8C8C8"; var dark = "#525252";
    
    if (c % 2 == 0) {
        r % 2 == 0 ? squareColor = light :  squareColor = dark;
    } else {
        r % 2 == 0 ? squareColor = dark : squareColor = light;
    }
    squareColor == light ? textColor = dark : textColor = light;

    ctx.beginPath();
    ctx.rect(c*s, r*s, s, s);
    ctx.fillStyle = squareColor;
    ctx.fill();
    ctx.closePath();

    if (highlight > 0) {
        var alpha = 0.7;
        for (var i = 0; i < s/2; i++) {
            if (i < 2) {
                fade = `rgba(18, 246, 146, 1.0)`;
            } else {
                fade = `rgba(18, 246, 146, ${alpha})`;
            }
            ctx.beginPath();
            ctx.rect(c*s+i, r*s+i, s-i*2, s-i*2);
            ctx.strokeStyle = fade;
            ctx.stroke();
            ctx.closePath();
            alpha -= highlight;
        }
    }

    if (r == 7) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(board[c][r].col.toUpperCase(), c*s + s - s/6, r*s + 86);
    }
    if (c == 0) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(board[c][r].row, c*s + 4, r*s + s/6);
    }
}

function drawPiece(c, r) {
    if (board[c][r].piece.type == type.BLANK) {
        return;
    }
    var color, piece;
    var x, y;
    board[c][r].piece.team == team.WHITE ? color = "w" : color = "b";
    piece = board[c][r].piece.letter;

    var img = new Image(s, s);
    img.src = `sprites/${color}${piece}.svg`
    if (board[c][r] == active) {
        if (drag) {
            x = pos[0] - s/2;
            y = pos[1] - s/2;
        } else {
            x = c*s;
            y = r*s;
        }
    } else if (board[c][r] != active) {
        x = c*s;
        y = r*s;
    }
    ctx.drawImage(img, x, y, s, s);
}

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var highlight = false;
    if (active != undefined && active.piece.type != type.BLANK) {
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
        highlight = true;
    }
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            drawSquare(c, r, 0);
            if (highlight) {
                var CR = getCR(active);
                if (CR[0] == c && CR[1] == r) {
                    drawSquare(c, r, 0.1);
                }
                for (const p of possible) {
                    if (p[0] == c && p[1] == r) {
                        drawSquare(c, r, 0.015);
                    }
                }
            }
        }
    }
    var precedent = false;
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (active != undefined && !precedent) {
                if (active.piece.type != type.BLANK) {
                    precedent = true;
                    var CR = getCR(active);
                    drawPiece(CR[0], CR[1]);
                }
            }
            drawPiece(c, r);
        }
    }

}
setInterval(display, 5)