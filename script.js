let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

let currentPlayer = 'circle';


function init() {
    render();
    renderCurrentPlayer();
}

// Zeigt an, welcher Spieler dran ist
function renderCurrentPlayer() {
    const infoDiv = document.getElementById('player-info');
    if (!infoDiv) return;
    if (isGameFinished()) {
        const winner = getWinner();
        if (winner) {
            infoDiv.innerHTML = winner === 'circle' ? 'Kreis hat gewonnen!' : 'Kreuz hat gewonnen!';
        } else {
            infoDiv.innerHTML = 'Unentschieden!';
        }
    } else {
        // Symbol etwas weiter nach unten versetzen
        if (currentPlayer === 'circle') {
            infoDiv.innerHTML = 'Kreis ist am Zug <span style="display:inline-block; vertical-align: middle; margin-bottom:-6px;">' + generateCircleSVG() + '</span>';
        } else {
            infoDiv.innerHTML = 'Kreuz ist am Zug <span style="display:inline-block; vertical-align: middle; margin-bottom:-6px;">' + generateCrossSVG() + '</span>';
        }
    }
}

// Gibt den Gewinner zurück ('circle', 'cross' oder null)
function getWinner() {
    const winCombo = getWinningCombination();
    if (winCombo) {
        return fields[winCombo[0]];
    }
    return null;
}

function render() {
    const contentDiv = document.getElementById('content');

    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    // Set table HTML inside a wrapper for aspect ratio
    contentDiv.innerHTML = `<div class="board-wrapper">${tableHtml}</div>`;
    renderCurrentPlayer();

    // Nach dem Rendern ggf. Gewinnlinie neu zeichnen
    if (isGameFinished()) {
        const winCombination = getWinningCombination();
        if (winCombination) {
            drawWinningLine(winCombination);
        }
    }
}

function handleClick(cell, index) {
    if (isGameFinished()) {
        return;
    }
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
        cell.onclick = null;
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';

        renderCurrentPlayer();

        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
            disableAllClicks();
            renderCurrentPlayer();
        }
    }
}

function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}

// Entfernt alle Gewinnlinien
function removeWinningLines() {
    const content = document.getElementById('content');
    if (!content) return;
    const lines = content.querySelectorAll('.winning-line');
    lines.forEach(line => line.remove());
}

function drawWinningLine(combination) {
    if (!combination) return;
    removeWinningLines();

    const lineColor = '#ffffff';
    const lineWidth = 5;

    const content = document.getElementById('content');
    const contentRect = content.getBoundingClientRect();

    const allCells = document.querySelectorAll('td');
    const startCell = allCells[combination[0]];
    const endCell = allCells[combination[2]];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2 - contentRect.left;
    const startY = startRect.top + startRect.height / 2 - contentRect.top;

    const endX = endRect.left + endRect.width / 2 - contentRect.left;
    const endY = endRect.top + endRect.height / 2 - contentRect.top;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    const line = document.createElement('div');
    line.className = 'winning-line';
    line.style.position = 'absolute';
    line.style.width = `${length}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startY - lineWidth / 2}px`;
    line.style.left = `${startX}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = 'left center';
    line.style.zIndex = 10;

    content.style.position = 'relative';
    content.appendChild(line);
}

function restartGame() {
    fields = [
        null,
        null,   
        null,
        null,
        null,
        null,   
        null,
        null,
        null,
    ];
    currentPlayer = 'circle';
    removeWinningLines();
    render();
    renderCurrentPlayer();
}

function generateCircleSVG() {
    const color = '#00b0ef';
    const width = 70;
    const height = 70;
    const strokewidth = 5;

    const svgHtml = `
      <svg width="${width}" height="${height}" viewBox="0 0 70 70">
        <circle
          cx="35"
          cy="35"
          r="30"
          stroke="${color}"
          stroke-width="${strokewidth}"
          fill="none"
          stroke-dasharray="188.4"
          stroke-dashoffset="188.4"
          transform="rotate(-90 35 35)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="188.4"
            to="0"
            dur="0.3s"
            fill="freeze"
          />
        </circle>
      </svg>
    `;
    return svgHtml;
}

function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;
    const strokewidth = 5;

    const svgHtml = `
      <svg width="${width}" height="${height}" viewBox="0 0 70 70">
        <line
          x1="15" y1="15"
          x2="55" y2="55"
          stroke="${color}"
          stroke-width="${strokewidth}"
          stroke-linecap="round"
          stroke-dasharray="56.57"
          stroke-dashoffset="56.57"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="56.57"
            to="0"
            dur="125ms"
            fill="freeze"
          />
        </line>
        <line
          x1="55" y1="15"
          x2="15" y2="55"
          stroke="${color}"
          stroke-width="${strokewidth}"
          stroke-linecap="round"
          stroke-dasharray="56.57"
          stroke-dashoffset="56.57"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="56.57"
            to="0"
            begin="125ms"
            dur="125ms"
            fill="freeze"
          />
        </line>
      </svg>
    `;
    return svgHtml;
}

// Gewinnlinie bei Resize neu zeichnen
window.addEventListener('resize', () => {
    if (isGameFinished()) {
        const winCombination = getWinningCombination();
        if (winCombination) {
            drawWinningLine(winCombination);
        } else {
            removeWinningLines();
        }
    } else {
        removeWinningLines();
    }
});
