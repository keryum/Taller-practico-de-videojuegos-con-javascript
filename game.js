const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const countLives = document.querySelector('#lives')
const time = document.querySelector('#time')
const reiniciarBtn = document.querySelector('#Re-start')
const tiempoRecord = document.querySelector('#tiempoRecord')
const FDJ = document.querySelector('.FDJ')
const FinDelJuego = document.querySelector('#FinDelJuego')
const jugarDeNuevo = document.querySelector('#jugarDeNuevo')

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

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

    let map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart && (playerPosition.x != undefined && playerPosition.y != undefined)) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showTiempoRecord();
    } else {
        !showTime()
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
    showLives();
    showTiempoRecord();
}

function levelWin() {
    level++;
    startGame()
}

function gameWin() {
    clearInterval(timeInterval)
    const recordTime = localStorage.getItem('Tiempo record')
    const playerTime = (Date.now() - timeStart);
    if(recordTime) {
        if (playerTime < recordTime) {
        localStorage.setItem('Tiempo record', playerTime);
        FinDelJuego.innerText = `¡Felicidades! 
        superaste tu record 🥳`
        } else {
        FinDelJuego.innerText = `No has superado tu record :(
            ¡Pero no te rindas, vuelve a intentarlo! 😊`
        }
    } else {
        FinDelJuego.innerText = `Felicidades, has acabado el juego.

        Ahora, 
        ¡Juega de nuevo y trata de superarte! 😄`
        localStorage.setItem('Tiempo record', playerTime)
    }
    FDJ.classList.toggle('inactive')
}

function levelFail() {
    
    if (lives > 1) {
        lives--;
    } else {
        gameFail()
        return;
    }
    playerPosition.x = undefined,
    playerPosition.y = undefined,
    console.log(lives)
    startGame()
}

function gameFail() {
    level = 0;
    playerPosition.x = undefined,
    playerPosition.y = undefined,
    lives = 3;
    console.log('Perdiste :c')
    startGame()
}

function showLives() {
    countLives.innerText = emojis['LIVE'].repeat(lives);
}

function showTime() {
    if(timeStart == undefined) {
        time.innerText = ''
    } else {
    time.innerText =  timeToMinutesAndSeconds(Date.now() - timeStart)
    }
}

function showTiempoRecord() {
    if (localStorage.getItem('Tiempo record') == undefined) {
        tiempoRecord.inerText = ''
    } else {
    tiempoRecord.innerText = timeToMinutesAndSeconds(`${localStorage.getItem('Tiempo record')}`);
    return;
    }
}

function movePlayer() {
    const giftCollisionX = (playerPosition.x.toFixed(0) == giftPosition.x.toFixed(0)-6);
    const giftCollisionY = ((playerPosition.y.toFixed(0)) == giftPosition.y.toFixed(0));
    const giftCollision = giftCollisionX && giftCollisionY;
    if (giftCollision) {
        levelWin()
    }

    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(0)-6 == playerPosition.x.toFixed(0)
        const enemyCollisionY = enemy.y.toFixed(0) == playerPosition.y.toFixed(0)
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
reiniciarBtn.addEventListener("click", restart)
jugarDeNuevo.addEventListener('click', restart)

function restart() {
    lives = 3;
    level = 0;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    timeStart = undefined;
    FDJ.classList.add('inactive')
    startGame()
}

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

function timeToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + "m" + (seconds < 10 ? '0' : '') + seconds + 's';
}