const initDom = document.getElementById('initForm');
const remapDom = document.getElementById('remap');
const restartDom = document.getElementById('restart');

const displayBarDom = document.getElementById('displayBar');
const currTimeDom = document.getElementById('currTime');

let initFormShow = true;
let width, height, numOfMines;
let rows = [];

initDom.addEventListener('submit', function(e) {
    e.preventDefault();
    width = initDom.querySelector("[name='col'").value;
    height = initDom.querySelector("[name='row']").value;
    numOfMines = initDom.querySelector("[name='numOfMines']").value;

    if (width < 5 || width > 30 || height < 5 || height > 30 || numOfMines < 0 || numOfMines > width * height) {
        alert('올바르지 않은 숫자입니다. \n행과 열 각각 5 ~ 30 로 입력가능합니다.\n지뢰 수는 맵 크기를 초과할 수 없습니다.');
        window.location.reload();
        return;
    }

    initFormDisplayChange();
    Game();
});

function initFormDisplayChange() {
    if (initFormShow) {
        initFormShow = false;
        initDom.style.display = 'none';
        restartDom.style.display = 'inline-block';
        remapDom.style.display = 'initial';
        displayBarDom.style.display = 'flex';
    } else {
        initFormShow = true;
        initDom.style.display = 'initial';
        restartDom.style.display = 'none';
        remapDom.style.display = 'none';
        displayBarDom.style.display = 'none';
    }
}

function Game() {
    const gameBoardDom = document.getElementById('gameBoard');
    gameBoardDom.style.display = 'inline-block';

    let playHour = playSec = playMin = 0;
    let timeStart;

    currTimeDom.textContent = getTotalPlayTime();
    restartDom.addEventListener('click', resetGame);

    initGame();
    timeStart = setInterval(timeCountUp, 1000);

    function initGame() {

        const mineSet = cellMineInit(width * height, numOfMines);
        let safeCellNum = width * height - numOfMines;
        let leftMineNum = numOfMines;

        const openedCellCountDom = document.getElementById('openedCellCount');
        const leftMineCountDom = document.getElementById('leftMineCount');
        openedCellCountDom.textContent = '안전한 셀 : ' + safeCellNum;
        leftMineCountDom.textContent = '남은 지뢰 : ' + leftMineNum;

        let toBeOpened = [];

        for (let i = 0; i < height; i++) {
            const row = [];
            rows.push(row);
            const rowDom = document.createElement('div');
            gameBoardDom.appendChild(rowDom);
            rowDom.className = 'row';

            for (let j = 0; j < width; j++) {
                const dom = document.createElement('div');
                dom.className = 'cell';
                rowDom.appendChild(dom);
                const cell = {
                    dom,
                    x: j,
                    y: i,
                    clicked: false,
                    marked: false,
                    isMine: false
                }
                if (mineSet.includes(i * width + j)) { cell.isMine = true; }
                row.push(cell);

                dom.addEventListener('click', function() { //cell left click, open or die
                    if (cell.clicked || cell.marked) return;
                    if (cell.isMine) return gameOver(false);

                    const neighbors = getNeighbors(cell);
                    let cellMineNum = neighbors.filter(neighbor => neighbor.isMine === true).length;

                    cell.dom.textContent = cellMineNum;
                    cell.dom.style.backgroundColor = 'white';

                    if (cellMineNum === 0) {
                        openAllZero(cell);
                        cell.dom.style.color = 'gray';
                    }

                    cell.clicked = true;

                    safeCellNum = safeCount();

                    if (safeCellNum <= 0) {
                        setTimeout(() => { return gameOver(true) }, 100);
                    }

                    openedCellCountDom.textContent = '안전한 셀 : ' + safeCellNum;

                });

                dom.addEventListener('contextmenu', function(e) { // cell right click, flag
                    e.preventDefault();

                    if (cell.clicked) return;
                    if (cell.marked) {
                        cell.marked = false;
                        cell.dom.textContent = "";
                        leftMineNum++;
                    } else {
                        cell.marked = true;
                        cell.dom.textContent = "🚩";
                        leftMineNum--;
                    }

                    leftMineCountDom.textContent = '남은 지뢰 : ' + leftMineNum;
                    return;
                });

                dom.addEventListener('mouseover', function() {
                    if (!cell.clicked) {
                        cell.dom.style.backgroundColor = '#02FF00';
                    }
                })

                dom.addEventListener('mouseout', function() {
                    if (!cell.clicked) {
                        cell.dom.style.backgroundColor = 'slateblue';
                    }
                })
            }
        }

        async function openAllZero(startCell) {
            getNeighbors(startCell).forEach(item => { if (item.clicked === false) toBeOpened.push(item) });
            while (toBeOpened.length) {
                await toBeOpened.pop().dom.click();
            }
        }
    }

    function timeCountUp() {
        playSec++;
        if (playSec >= 60) {
            playSec = 0;
            playMin++;
        }
        if (playMin >= 60) {
            playMin = 0;
            playHour++;
        }
        currTimeDom.textContent = getTotalPlayTime();
    }

    function getTotalPlayTime() {
        let totalPlayTime = ('0' + playMin).slice(-2) + 'm : ' + ('0' + playSec).slice(-2) + 's';
        if (playHour > 0) { totalPlayTime = ('0' + playHour).slice(-2) + 'h : ' + totalPlayTime; }
        return totalPlayTime;
    }

    function cellMineInit(mapSize, numOfMines) {
        let mineAlloc = [];
        for (let i = 0; i < numOfMines; i++) {
            let num = Math.floor(Math.random() * mapSize);
            if (!mineAlloc.includes(num)) {
                mineAlloc.push(num);
            } else {
                i--;
            }
        }
        return mineAlloc;
    }

    function safeCount() {
        let safeCellNum = width * height - numOfMines;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (rows[i][j].clicked === true) safeCellNum--;
            }
        }
        return safeCellNum;
    }

    function getNeighbors(cell) {
        const x = cell.x;
        const y = cell.y;
        const neighbors = [];
        for (let i = Math.max(0, y - 1); i <= Math.min(height - 1, y + 1); i++) {
            for (let j = Math.max(0, x - 1); j <= Math.min(width - 1, x + 1); j++) {
                if (x === j && y === i) continue;
                neighbors.push(rows[i][j]);
            }
        }
        return neighbors;
    }

    function gameOver(isWin) {
        if (isWin) {
            alert(`CONGRATULATION\nG A M E  C L E A R !!\nRecord : [${totalPlay}]`);
            window.location.reload();
            clearInterval(timeStart);
        } else {
            alert('Baaaaaannnnnng~~ \nR E G A M E!');
            resetGame();
        }
    }

    function resetGame() {
        rows = [];
        for (let i = 0; i < height; i++) {
            row = document.querySelector('.row');
            gameBoardDom.removeChild(row);
        }
        clearInterval(timeStart);
        playHour = playSec = playMin = 0;
        currTimeDom.textContent = getTotalPlayTime();
        timeStart = setInterval(timeCountUp, 1000);
        initGame();
    }
}