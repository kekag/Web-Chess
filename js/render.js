function highlightSquare(c, r, glow, g) {
    var alpha = 0.7;
    var fade;
    for (var i = 1; i < s/2; i++) { 
        fade = `rgba(${g[0]}, ${g[1]}, ${g[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.rect(c*s+i, r*s+i, s-i*2, s-i*2);
        ctx.strokeStyle = fade;
        ctx.stroke();
        ctx.closePath();
        alpha -= glow;
    }
}

function drawSquare(c, r) {
    var squareColor, textColor;
    var dark, light, glowRGB;
    var light = "#C0C0C0"; var dark = "#525252";
    var glow = 0;
    
    if (c % 2 == 0) {
        r % 2 == 0 ? squareColor = light :  squareColor = dark;
    } else {
        r % 2 == 0 ? squareColor = dark : squareColor = light;
    }
    squareColor == light ? textColor = dark : textColor = light;

    if (active != undefined) {
        if (active.col == c && active.row == r) {
            // glowRGB = [66, 12, 238];
            glowRGB = [255, 255, 255];
            glow = 0.015;
        }
        for (const m of active.moves()) {
            if (m[0] == c && m[1] == r) {
                glowRGB = [18, 246, 146];
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
        highlightSquare(c, r, glow, glowRGB);
    }

    // Draw row and column text
    if (r == 7) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(cols[board[c][r].col].toUpperCase(), c*s + s - s/6, r*s + 86);
    }
    if (c == 0) {
        ctx.font = `${s/6}px sans-serif`;
        ctx.strokeStyle = textColor;
        ctx.strokeText(rows[board[c][r].row], c*s + 4, r*s + s/6);
    }
}

function drawPiece(c, r) {
    if (board[c][r].type == type.BLANK) {
        return;
    }

    var img = new Image(s, s);
    img.src = `sprites/${board[c][r].team.value}${board[c][r].type}.svg`

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
        ac = active.col;
        ar = active.row;
    }
    for (var c = 0; c < 8; c++) {
        for (var r = 0; r < 8; r++) {
            if (c != ac || r != ar) {
                if (board[c][r] != promotion) {
                    drawPiece(c, r);
                } else {
                    highlightSquare(c, r, 0.015, [18, 246, 146]);

                    ctx.strokeStyle = `rgba(0, 0, 0, 1.0)`;

                    ctx.beginPath();
                    ctx.moveTo(c*s + s/2, r*s);
                    ctx.lineTo(c*s + s/2, r*s + s);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(c*s, r*s + s/2);
                    ctx.lineTo(c*s + s, r*s + s/2);
                    ctx.stroke();

                    var t;
                    r == 0 ? t = team.WHITE : t = team.BLACK;

                    var img = new Image(s/2, s/2);
                    img.src = `sprites/${t}Q.svg` 
                    ctx.drawImage(img, c*s, r*s, s/2, s/2);
                    img.src = `sprites/${t}R.svg` 
                    ctx.drawImage(img, c*s+s/2, r*s, s/2, s/2);
                    img.src = `sprites/${t}B.svg` 
                    ctx.drawImage(img, c*s, r*s+s/2, s/2, s/2);
                    img.src = `sprites/${t}N.svg` 
                    ctx.drawImage(img, c*s+s/2, r*s+s/2, s/2, s/2);
                }
            }
        }
    }
    if (active != undefined) drawPiece(ac, ar);
}

setInterval(display, 10);