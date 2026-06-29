const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const enemy2 = document.getElementById("enemy2");

const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const ui = document.getElementById("ui");
const scoreText = document.getElementById("score");
const pauseScreen = document.getElementById("pauseScreen");
const gameOverScreen = document.getElementById("gameOver");
const finalTimeText = document.getElementById("finalTime");

const menuMusic = document.getElementById("menuMusic");
const gameMusic = document.getElementById("gameMusic");
const deathSound = document.getElementById("deathSound");

const muteBtn = document.getElementById("muteBtn");

/* ================= AUDIO STATE ================= */
let muted = false;

/* toggle mute */
function toggleMute() {
    muted = !muted;

    if (muted) {
        stopAllAudio();
        muteBtn.innerText = " Sound: OFF";
    } else {
        muteBtn.innerText = " Sound: ON";

        // resume correct music based on state
        if (running) {
            playGameMusic();
        } else {
            playMenuMusic();
        }
    }
}

/* safe audio helpers */
function playSafe(audio) {
    if (!muted && audio) {
        audio.play().catch(() => {});
    }
}

function stopAllAudio() {
    menuMusic.pause();
    gameMusic.pause();
}

/* settings */
const gameWidth = 1040;
const gameHeight = 635;
const boxSize = 30;

/* player */
let playerX = 50;
let playerY = 50;
let playerSpeed = 3.2;

/* enemies */
let enemyX = 700;
let enemyY = 400;
let enemySpeed = 1.2;

let enemy2X = 200;
let enemy2Y = 200;
let enemy2Speed = 1.0;
let enemy2Active = false;

/* state */
let running = false;
let paused = false;
let time = 0;
let timer = null;
let keys = {};
let frameId = null;

/* input */
document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape") togglePause();
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

/* reset game */
function resetGame() {

    playerX = 50;
    playerY = 50;

    enemyX = 700;
    enemyY = 400;

    enemy2X = 200;
    enemy2Y = 200;

    time = 0;
    paused = false;
    keys = {};

    playerSpeed = 3.2;
    enemySpeed = 1.2;
    enemy2Speed = 1.0;

    enemy2Active = false;

    enemy2.style.display = "none";

    drawPlayer();
}

/* MUSIC */
function playMenuMusic() {
    stopAllAudio();
    menuMusic.currentTime = 0;
    playSafe(menuMusic);
}

function playGameMusic() {
    stopAllAudio();
    gameMusic.currentTime = 0;
    playSafe(gameMusic);
}

/* START GAME */
function startGame() {

    resetGame();
    running = true;

    menu.style.display = "none";
    gameOverScreen.style.display = "none";
    pauseScreen.style.display = "none";

    gameArea.style.display = "block";
    ui.style.display = "block";

    scoreText.innerText = "Time: 0";

    playGameMusic();

    clearInterval(timer);
    cancelAnimationFrame(frameId);

    timer = setInterval(() => {

        if (!running || paused) return;

        time++;
        scoreText.innerText = "Time: " + time;

        enemySpeed += 0.05;
        playerSpeed += 0.02;

        if (time === 20 && !enemy2Active) {
            enemy2Active = true;
            enemy2.style.display = "block";
        }

        if (enemy2Active) {
            enemy2Speed += 0.03;
        }

    }, 1000);

    loop();
}

/* PAUSE */
function togglePause() {

    if (!running) return;

    paused = !paused;

    if (paused) {
        pauseScreen.style.display = "flex";
        gameMusic.pause();
    } else {
        pauseScreen.style.display = "none";
        playSafe(gameMusic);
        loop();
    }
}

/* MENU */
function goToMenu() {

    running = false;
    paused = false;

    clearInterval(timer);
    cancelAnimationFrame(frameId);

    gameArea.style.display = "none";
    ui.style.display = "none";
    pauseScreen.style.display = "none";
    gameOverScreen.style.display = "none";

    menu.style.display = "flex";

    playMenuMusic();
}

/* PLAYER */
function movePlayer() {

    if (keys["w"]) playerY -= playerSpeed;
    if (keys["s"]) playerY += playerSpeed;
    if (keys["a"]) playerX -= playerSpeed;
    if (keys["d"]) playerX += playerSpeed;

    playerX = Math.max(0, Math.min(gameWidth - boxSize, playerX));
    playerY = Math.max(0, Math.min(gameHeight - boxSize, playerY));
}

function drawPlayer() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

/* ENEMY 1 */
function moveEnemy() {

    let dx = playerX - enemyX;
    let dy = playerY - enemyY;
    let dist = Math.sqrt(dx * dx + dy * dy);

    enemyX += (dx / (dist || 1)) * enemySpeed;
    enemyY += (dy / (dist || 1)) * enemySpeed;

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";

    if (Math.abs(playerX - enemyX) < 25 && Math.abs(playerY - enemyY) < 25) {
        gameOver();
    }
}

/* ENEMY 2 */
function moveEnemy2() {

    if (!enemy2Active) return;

    let dx = playerX - enemy2X;
    let dy = playerY - enemy2Y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    enemy2X += (dx / (dist || 1)) * enemy2Speed;
    enemy2Y += (dy / (dist || 1)) * enemy2Speed;

    enemy2.style.left = enemy2X + "px";
    enemy2.style.top = enemy2Y + "px";

    if (Math.abs(playerX - enemy2X) < 25 && Math.abs(playerY - enemy2Y) < 25) {
        gameOver();
    }
}

/* LOOP */
function loop() {

    if (!running || paused) return;

    movePlayer();
    drawPlayer();
    moveEnemy();
    moveEnemy2();

    frameId = requestAnimationFrame(loop);
}

/* GAME OVER */
function gameOver() {

    running = false;
    paused = false;

    clearInterval(timer);
    cancelAnimationFrame(frameId);

    gameArea.style.display = "none";
    ui.style.display = "none";
    pauseScreen.style.display = "none";
    gameOverScreen.style.display = "flex";

    finalTimeText.innerText = "You survived: " + time + " seconds";

    stopAllAudio();

    if (!muted && deathSound) {
        deathSound.currentTime = 0;
        deathSound.play().catch(() => {});
    }
}

/* INIT */
window.onload = () => {
    menu.style.display = "flex";
};