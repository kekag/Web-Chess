function drawSquare(c, r) {
    var squareColor, textColor;
    var dark, light, fade;
    var light = "#C8C8C8"; var dark = "#525252";
    var glow = 0;
    
    if (c % 2 == 0) {
        r % 2 == 0 ? squareColor = light :  squareColor = dark;
    } else {
        r % 2 == 0 ? squareColor = dark : squareColor = light;
    }
    squareColor == light ? textColor = dark : textColor = light;

    if (active != undefined) {
        var CR = getCR(active);
        if (CR[0] == c && CR[1] == r) {
            glow = 0.1;
        }
        for (const p of possible) {
            if (p[0] == c && p[1] == r) {
                glow = 0.015;
            }
        }
    }

    // Draw filled tile
    ctx.beginPath();
    ctx.rect(c*s, r*s, s, s);
    ctx.fillStyle = squareColor;
    ctx.fill();
    ctx.closePath();

    // Highlight possible moves and active piece    
    if (glow > 0) {
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
            alpha -= glow;
        }
    }

    // Draw row and column text
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

    var img = new Image(s, s);
    img.src = `sprites/${board[c][r].piece.team}${board[c][r].piece.type}.svg`

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
    
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            drawSquare(c, r);
        }
    }
    var ac, ar;
    if (active != undefined) {
        var CR = getCR(active);
        ac = CR[0]; ar = CR[1];
    } 
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (c != ac || r != ar) {
                if (board[c][r] != promotionSquare) {
                    drawPiece(c, r);
                } else {
                    ctx.beginPath();
                    ctx.moveTo(c*s, r*s);
                    ctx.lineTo(c*s + s, r*s + s);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(c*s + s, r*s);
                    ctx.lineTo(c*s, r*s + s);
                    ctx.stroke();

                    var q = new Image(s/2, s/2);
                    q.src = `sprites/${board[c][r].piece.team}${Q}.svg` 
                    var qx = c*s + s/4;
                    var qy = r*s;
                    ctx.drawImage(q, qx, qy, s/2, s/2);

                    var r = new Image(s/2, s/2);
                    r.src = `sprites/${board[c][r].piece.team}${R}.svg` 
                    var rx = c*s + s/4;
                    var ry = r*s + s/2;
                    ctx.drawImage(r, rx, ry, s/2, s/2);

                    var b = new Image(s/2, s/2);
                    b.src = `sprites/${board[c][r].piece.team}${B}.svg` 
                    var bx = c*s;
                    var by = r*s + s/4;
                    ctx.drawImage(b, bx, by, s/2, s/2);

                    var n = new Image(s/2, s/2);
                    n.src = `sprites/${board[c][r].piece.team}${N}.svg` 
                    var nx = c*s + s/2;
                    var ny = r*s + s/4;
                    ctx.drawImage(n, nx, ny, s/2, s/2);
                }
            }
        }
    }
    if (active != undefined) drawPiece(ac, ar);
}

setInterval(display, 5)