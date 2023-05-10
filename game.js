const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementSize;
let level = 0;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight >= window.innerWidth) {
        canvasSize = window.innerWidth*0.75;
    } else if (window.innerHeight < window.innerWidth) {
        canvasSize = (window.innerHeight*0.75);
    }
    
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    if (window.innerHeight >= window.innerWidth) {
        elementSize = (canvasSize/10)-2.0;
    } else if (window.innerHeight < window.innerWidth) {
        elementSize = (canvasSize/10)-2.5
    }

    startGame();
}
function startGame() {
    game.font = elementSize + 'px Verdana';
    game.textAlign = '';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    const mapRows = map.trim().split('\n')
    const mapRowCols = mapRows.map(row => row.trim().split(''))

    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize)
    
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize*colI;
            const posY = (elementSize)*(rowI+1)

            if (col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX-6;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                })
            }

            game.fillText(emoji, posX, posY)
        })
    });

    movePlayer();
}

function levelWin() {
    level++;
    startGame()
}

function gameWin() {
    console.log('Ganaste el juego siuuuuuuuuu')
}

function levelFail() {
    playerPosition.x = undefined,
    playerPosition.y = undefined,
    startGame()
}

function movePlayer() {
    const giftCollisionX = (playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1)-6);
    const giftCollisionY = ((playerPosition.y.toFixed(1)) == giftPosition.y.toFixed(1));
    const giftCollision = giftCollisionX && giftCollisionY;
    if (giftCollision) {
        levelWin()
    }

    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(1)-6 == playerPosition.x.toFixed(1)
        const enemyCollisionY = enemy.y.toFixed(1) == playerPosition.y.toFixed(1)
        return enemyCollisionX && enemyCollisionY;
    });
    if(enemyCollision) {
        levelFail()
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')


btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

window.addEventListener("keydown", (e) => {
    let tecla = e.key;

    switch (tecla) {
    case "ArrowUp":
    case "w":
        moveUp();
        break;

    case "ArrowDown":
    case "s":
        moveDown();
        break;

    case "a":
    case "ArrowLeft":
        moveLeft();
        break;

    case "d":
    case "ArrowRight":
    moveRight();
        break;

    default:
        break;
    }
});

function moveUp() {
    if(Math.floor(playerPosition.y) > elementSize){
        playerPosition.y = (playerPosition.y - elementSize) 
        startGame()
    }
}

function moveLeft() {
    if(Math.floor(playerPosition.x) > 0){
        playerPosition.x = (playerPosition.x - elementSize) 
        startGame()
    }
    console.log("Me movere hacia izq");
}

function moveRight() {
    if(Math.floor(playerPosition.x) < canvasSize-(elementSize*2)){
        playerPosition.x = (playerPosition.x + elementSize) 
        startGame()
    }
    console.log("Me movere hacia derecha");
}

function moveDown() {
    if(Math.floor(playerPosition.y) < (canvasSize-elementSize)){
        playerPosition.y = (playerPosition.y + elementSize) 
        startGame()
    }
}
