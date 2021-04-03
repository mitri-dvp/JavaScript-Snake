// Elements
const gameMain = document.querySelector('.game--main');
const controls = document.querySelectorAll('.game--controls button');
const player = document.querySelector('.game--player');
const scoreSpan = document.querySelector('.game--score span');
const highscoreSpan = document.querySelector('.game--high-score span');
const skinForm = document.querySelector('.main-menu');
const choices = document.querySelectorAll('.choice');
const gameSpeed = 80;
const scores = [];
let point = document.createElement('div');
let score = 0;
let highscore;
localStorage.getItem('highscore') ? (highscore = JSON.parse(localStorage.getItem('highscore'))) : (highscore = [0]);
let isX = true;
let isY = false;
let n = 1;
let beforeX = '0em';
let beforeY = '0em';
let tails = [];
let dataX = [];
let dataY = [];
let playing = true;
let isOver = false;
let paused;
let gameOver;
let choice;
let move_count = true;
let move_allow = true;
const select_sfx = new Audio('./css/sounds/select.mp3');
const blop_sfx = new Audio('./css/sounds/blop.mp3');
const bite_sfx = new Audio('./css/sounds/bite.mp3');
const end_sfx = new Audio('./css/sounds/end.mp3');
const move1_sfx = new Audio('./css/sounds/move1.mp3');
const move2_sfx = new Audio('./css/sounds/move2.mp3');

// Highscore
highscoreSpan.innerHTML = highscore;

// Listeners
choices.forEach(choice => {
  choice.addEventListener('click', () => {
    blop_sfx.currentTime = 0
    blop_sfx.play()
  })
})
controls.forEach(control => {
  control.addEventListener('touchstart', changeDirection);
  control.addEventListener('touchstart', pauseGame);
});
window.addEventListener('keydown', changeDirection);
window.addEventListener('keydown', pauseGame);
skinForm.addEventListener('submit', startGame);

// Create Point
let gameInterval;
function startGame(e) {
  e.preventDefault();
  select_sfx.currentTime = 0
  select_sfx.play()
  const chkBoxes = this.querySelectorAll('input[type=radio]');
  chkBoxes.forEach(box => (box.checked ? (choice = box.value) : 0));
  changeSkin();
  skinForm.classList.add('hide')
  gameInterval = setInterval(movePlayer, gameSpeed);
  createPoint();
}

// Functions
function pauseGame(e) {
  if (e.keyCode == 13 || e.target.className == 'start') {
    if (!isOver) {
      if (playing) {
        clearInterval(gameInterval);
        paused = document.createElement('div');
        paused.classList.add('game--paused');
        paused.innerHTML = 'Paused';
        gameMain.appendChild(paused);
        select_sfx.currentTime = 0
        select_sfx.play()
        playing = false;
      } else {
        paused.remove();
        gameInterval = setInterval(movePlayer, gameSpeed);
        select_sfx.currentTime = 0
        select_sfx.play()
        playing = true;
      }
    } else {
      gameOver.remove();
      resetGame();
    }
  }
}
function movePlayer(e) {
  move_allow = true
  tails = document.querySelectorAll('.tail');
  beforeX = `${parseInt(player.style.left)}em`;
  beforeY = `${parseInt(player.style.top)}em`;
  dataY.push(beforeY);
  dataX.push(beforeX);
  tails.forEach(tail => {
    if (tail.offsetTop == point.offsetTop && tail.offsetLeft == point.offsetLeft) {
      createPoint();
      return 0;
    }
  });
  if (isX) {
    player.style.left = `${parseInt(player.style.left) + n}em`;
  } else if (isY) {
    player.style.top = `${parseInt(player.style.top) + n}em`;
  }
  // Left
  if (parseInt(player.style.left) < 0) {
    player.style.left = `${gameMain.offsetWidth / player.offsetHeight - 1}em`;
  }
  // Right
  if (parseInt(player.style.left) >= gameMain.offsetWidth / player.offsetHeight) {
    player.style.left = `0em`;
  }
  // Up
  if (parseInt(player.style.top) < 0) {
    player.style.top = `${gameMain.offsetHeight / player.offsetHeight - 1}em`;
  }
  // Down
  if (parseInt(player.style.top) >= gameMain.offsetHeight / player.offsetHeight) {
    player.style.top = `0em`;
  }
  checkPoint();
  updateTail();
}

let prev_key;
function changeDirection(e) {
  if(prev_key === e.keyCode) return
  prev_key = e.keyCode
  if(!move_allow) return
  move_allow = false
  switch (e.keyCode) {
    // Left
    case 37:
      if (isX && n == 1) {
        return;
      }
      n = -1;
      isX = true;
      isY = false;
      if(move_count) {
        move1_sfx.currentTime = 0;
        move1_sfx.play();
        move_count = false
      } else { 
        move2_sfx.currentTime = 0;
        move2_sfx.play();
        move_count = true
      }
      break;
    // Right
    case 39:
      if (isX && n == -1) {
        return;
      }
      n = 1;
      isX = true;
      isY = false;
      if(move_count) {
        move1_sfx.currentTime = 0;
        move1_sfx.play();
        move_count = false
      } else { 
        move2_sfx.currentTime = 0;
        move2_sfx.play();
        move_count = true
      }
      break;
    // Up
    case 38:
      if (isY && n == 1) {
        return;
      }
      n = -1;
      isX = false;
      isY = true;
      if(move_count) {
        move1_sfx.currentTime = 0;
        move1_sfx.play();
        move_count = false
      } else { 
        move2_sfx.currentTime = 0;
        move2_sfx.play();
        move_count = true
      }
      break;
    // Down
    case 40:
      if (isY && n == -1) {
        return;
      }
      n = 1;
      isX = false;
      isY = true;
      if(move_count) {
        move1_sfx.currentTime = 0;
        move1_sfx.play();
        move_count = false
      } else { 
        move2_sfx.currentTime = 0;
        move2_sfx.play();
        move_count = true
      }
      break;
    default:
  }
  switch (e.target.className) {
    // Left
    case 'left':
      if (isX && n == 1) {
        return;
      }
      n = -1;
      isX = true;
      isY = false;
      break;
    // Right
    case 'right':
      if (isX && n == -1) {
        return;
      }
      n = 1;
      isX = true;
      isY = false;
      break;
    // Up
    case 'up':
      if (isY && n == 1) {
        return;
      }
      n = -1;
      isX = false;
      isY = true;
      break;
    // Down
    case 'down':
      if (isY && n == -1) {
        return;
      }
      n = 1;
      isX = false;
      isY = true;
      break;
    default:
  }
}

function checkPoint() {
  if (player.offsetLeft == point.offsetLeft && player.offsetTop == point.offsetTop) {
    createPoint();
    makeTail();
    score++;
    // SCOREHERE
    if(score > highscore) {
      scoreSpan.parentElement.classList.add('new-highscore');
    }
    bite_sfx.currentTime = 0
    bite_sfx.play()
    scoreSpan.textContent = score;
  }
  checkTail();
}

function checkTail() {
  setTimeout(() => {
    tails = document.querySelectorAll('.tail');
    tails.forEach(tail => {
      if (tail.offsetTop == player.offsetTop && tail.offsetLeft == player.offsetLeft) {
        clearInterval(gameInterval);
        gameOver = document.createElement('div');
        gameOver.classList.add('game--over');
        gameOver.innerHTML = 'GameOver!';
        gameMain.appendChild(gameOver);
        end_sfx.currentTime = 0
        end_sfx.play()
        isOver = true;
      }
    });
  }, 0);
}

function createPoint() {
  point.remove();
  point = document.createElement('div');
  point.classList.add('game--point');
  point.style.top = `${Math.floor(Math.random() * (gameMain.offsetHeight / player.offsetHeight))}em`;
  point.style.left = `${Math.floor(Math.random() * (gameMain.offsetWidth / player.offsetHeight))}em`;
  gameMain.insertBefore(point, player);
}

function makeTail() {
  const tail = player.cloneNode(true);
  tail.classList.add('tail');
  addSkinToTail(tail);
  gameMain.appendChild(tail);
}

function updateTail() {
  tails = document.querySelectorAll('.tail');
  dataX.splice(0, dataX.length - tails.length);
  tails.forEach((tail, i) => {
    tail.style.left = dataX[dataX.length - (i + 1)];
    tail.style.top = dataY[dataY.length - (i + 1)];
  });
}

function resetGame() {
  select_sfx.currentTime = 0
  select_sfx.play()
  player.style.top = '0em';
  player.style.left = '0em';
  tails.forEach(tail => tail.remove());
  scores.push(score);
  highscore = scores.sort((a, b) => b - a)[0];
  localStorage.setItem('highscore', JSON.stringify(highscore));
  highscoreSpan.innerHTML = highscore;
  isOver = false;
  score = 0;
  scoreSpan.innerHTML = score;
  n = 1;
  isX = true;
  gameInterval = setInterval(movePlayer, gameSpeed);
}

function addSkinToTail(tail) {
  switch (choice) {
    case 'coral':
      tail.classList.add('coral');
      break;
    case 'thorny':
      tail.classList.add('thorny');
      break;
    case 'pink':
      tail.classList.add('pink');
      break;
    default:
  }
}

function changeSkin() {
  switch (choice) {
    case 'coral':
      player.classList.add('coral');
      break;
    case 'thorny':
      player.classList.add('thorny');
      break;
    case 'pink':
      player.classList.add('pink');
      break;
    default:
  }
}
