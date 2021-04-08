Game(10, 10, 10);


function Game(width, height, numOfMines) {
    const gameBoard = document.getElementById('gameBoard');
    const rows = [];
    let safeCellCount = width * height - numOfMines;

    function initGame(width, height, numOfMines) {

        const mineSet = cellMineInit(width * height, numOfMines);
        console.log(mineSet);

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

                dom.addEventListener('click', function() {
                    if (cell.clicked || cell.marked) return;
                    if (cell.isMine) return gameOver(false);
                    // console.log(cell.x, cell.y);

                    const neighbors = getNeighbors(cell);
                    // console.log(neighbors);

                    safeCellCount -= 1;
                    cell.dom.textContent = neighbors.filter(neighbor => neighbor.isMine === true).length;

                    cell.clicked = true;
                    if (safeCellCount <= 0) {
                        setTimeout(() => { return gameOver(true) }, 100);
                    }

                });

                dom.addEventListener('contextmenu', function(e) {
                    e.preventDefault();

                    if (cell.clicked) return;
                    if (cell.marked) {
                        cell.marked = false;
                        cell.dom.textContent = "";
                    } else {
                        cell.marked = true;
                        cell.dom.textContent = "★";
                    }
                    return;

                });



                if (mineSet.includes(i * 10 + j)) {
                    cell.isMine = true;
                }

                row.push(cell);
            }
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
            alert('C O N G R A T U L A T I O N \nG A M E  C L E A R !!');
            window.location.reload();
        } else {
            alert('Baaaaaannnnnng~~ \nR E G A M E!');
            window.location.reload();
        }


    }

}


// const initDom = document.querySelector('#initForm');
// let initshow = true;

// const refreshDom = document.getElementById('refreshForm');

// initDom.addEventListener('submit', function(e) {
//     e.preventDefault();

//     const width = initDom.querySelector("[name='col'").value;
//     const height = initDom.querySelector("[name='row']").value;
//     const numOfMines = initDom.querySelector("[name='numOfMines']").value;

//     if (width <= 0 || width > 30 || height <= 0 || height > 30 || numOfMines < 0 || numOfMines > width * height) {
//         alert("올바르지 않은 숫자입니다. \n 행과 열은 최대 30까지 가능합니다.");
//         window.location.reload();
//         return;
//     }

//     initFormDisplayChange();

//     Game(width, height, numOfMines);




// });

// function initFormDisplayChange() {
//     if (initshow) {
//         initshow = false;
//         initDom.style.display = "none";
//         refreshDom.style.display = "initial";
//     } else {
//         initshow = true;
//         initDom.style.display = "initial";
//         refreshDom.style.display = "none";
//     }

// }

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