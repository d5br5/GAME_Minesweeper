const initDom = document.querySelector('#initForm');

const remapDom = document.getElementById('remap');
const displayBarDom = document.getElementById('displayBar');
const playTimerDOM = document.getElementById('playTimer');
const currTimeDom = document.getElementById('currTime');
const restartDom = document.getElementById("restart");

let initFormShow = true;

let width;
let height;
let numOfMines;

initDom.addEventListener('submit', function(e) {

    e.preventDefault();

    width = initDom.querySelector("[name='col'").value;
    height = initDom.querySelector("[name='row']").value;
    numOfMines = initDom.querySelector("[name='numOfMines']").value;

    if (width < 5 || width > 30 || height < 5 || height > 30 || numOfMines < 0 || numOfMines > width * height) {
        alert("올바르지 않은 숫자입니다. \n행과 열 각각 5 ~ 30 로 입력가능합니다.");
        window.location.reload();
        return;
    }

    initFormDisplayChange();

    Game(width, height, numOfMines);

});


function initFormDisplayChange() {
    if (initFormShow) {
        initFormShow = false;
        initDom.style.display = "none";
        restartDom.style.display = "inline-block";
        remapDom.style.display = "initial";
        displayBarDom.style.display = "flex"
    } else {
        initFormShow = true;
        initDom.style.display = "initial";
        restartDom.style.display = "none";
        remapDom.style.display = "none";
        displayBarDom.style.display = "none"
    }
}

function Game(width, height, numOfMines) {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.display = "inline-block";

    let totalPlay;
    let playHour = 0;
    let playSec = 0;
    let playMin = 0;

    totalPlay = ("0" + playMin).slice(-2) + "m : " + ("0" + playSec).slice(-2) + "s";
    currTimeDom.textContent = totalPlay;

    const rows = [];

    const timeStart = setInterval(() => {
        playSec++;
        if (playSec >= 60) {
            playSec = 0;
            playMin++;
        }
        if (playMin >= 60) {
            playMin = 0;
            playHour++;
        }

        if (playHour > 0) {
            totalPlay = ("0" + playHour).slice(-2) + "h : " + totalPlay;
        } else {
            totalPlay = ("0" + playMin).slice(-2) + "m : " + ("0" + playSec).slice(-2) + "s";
        }

        currTimeDom.textContent = totalPlay;
    }, 1000);

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

    function initGame(width, height, numOfMines) {

        const mineSet = cellMineInit(width * height, numOfMines);
        let safeNum = width * height - numOfMines;
        //let safeNum = safeCount();
        let leftMine = numOfMines;

        const cellOpenedDom = document.getElementById('cellOpened');
        const leftMineDom = document.getElementById('leftMine');

        cellOpenedDom.textContent = "안전한 셀 : " + safeNum;
        leftMineDom.textContent = "남은 지뢰 : " + leftMine;

        //console.log(mineSet);


        for (let i = 0; i < height; i++) {
            const row = [];
            rows.push(row);

            const rowDom = document.createElement('div');
            gameBoard.appendChild(rowDom);
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

                dom.addEventListener('click', function() { //cell left click, open or die
                    if (cell.clicked || cell.marked) return;
                    if (cell.isMine) return gameOver(false);

                    const neighbors = getNeighbors(cell);

                    let cellMineNum = neighbors.filter(neighbor => neighbor.isMine === true).length;

                    cell.dom.textContent = cellMineNum;
                    cell.dom.style.backgroundColor = 'white';


                    if (cellMineNum === 0) {
                        for (let i = 0; i < neighbors.length; i++) {
                            if (neighbors[i].clicked === false) {
                                neighbors[i].dom.click();
                            }

                        }
                        cell.dom.style.color = "gray";
                    }

                    cell.clicked = true;

                    safeNum = safeCount();
                    console.log(safeNum);
                    if (safeNum <= 0) {
                        setTimeout(() => { return gameOver(true) }, 100);
                    }

                    cellOpenedDom.textContent = "안전한 셀 : " + safeNum;

                });

                dom.addEventListener('contextmenu', function(e) { // cell right click, flag
                    e.preventDefault();

                    if (cell.clicked) return;
                    if (cell.marked) {
                        cell.marked = false;
                        cell.dom.textContent = "";
                        leftMine++;
                    } else {
                        cell.marked = true;
                        cell.dom.textContent = "🚩";
                        leftMine--;
                    }

                    leftMineDom.textContent = "남은 지뢰 : " + leftMine;
                    return;
                });

                if (mineSet.includes(i * width + j)) {
                    cell.isMine = true;
                }
                row.push(cell);
            }
        }

        function safeCount() {
            let safeNum = width * height - numOfMines;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (rows[i][j].clicked == true) safeNum--;
                }
            }
            return safeNum;
        }



    }

    initGame(width, height, numOfMines);



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
            window.location.reload();
        }

    }

}