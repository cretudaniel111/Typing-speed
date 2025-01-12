const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let color = [];
let wordIndex = 0;
let correctLetters = 0;
let currentLetter = 0;
let correctWords = 0;
let middleYPage = canvas.height / 2;
let seconds = 60;
let miliseconds = 1000;
let randomWords = [];
let spacing = 20;

function timer() {
  seconds -= 1;
  if (seconds == 0) {
    gameEnded();
    clearInterval(1);
    return;
  }
}

setInterval(timer, miliseconds);

async function randomWordsAPI() {
  const url = "https://random-word-api.herokuapp.com/word?number=8";
  const response = await fetch(url);
  randomWords = await response.json();
  color = randomWords.map((word) => Array(word.length).fill("white"));
  updatedText();
  playTheGame(randomWords);
}

randomWordsAPI();

function playTheGame(randomWords) {
  window.addEventListener("keypress", function (event) {
    if (event.key == randomWords[wordIndex][currentLetter]) {
      color[wordIndex][currentLetter] = "green";
      ++correctLetters;
    } else {
      color[wordIndex][currentLetter] = "red";
    }
    ++currentLetter;
    if (currentLetter == randomWords[wordIndex].length) {
      if (correctLetters == randomWords[wordIndex].length) {
        ++correctWords;
      }
      ++wordIndex;
      currentLetter = 0;
      correctLetters = 0;
    }
    if (wordIndex == randomWords.length) {
      gameEnded();
      return;
    }
    updatedText();
  });
}

function updatedText() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px Courier";
  ctx.textAlign = "center";
  let middleXPage = 15;
  for (let i = 0; i < randomWords.length; ++i) {
    for (let j = 0; j < randomWords[i].length; ++j) {
      ctx.fillStyle = color[i][j];
      let charWidth = ctx.measureText(randomWords[i][j]).width;
      ctx.fillText(randomWords[i][j], middleXPage, middleYPage);
      middleXPage += charWidth;
    }
    middleXPage += spacing;
  }
}

function gameEnded() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "80px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(
    `You written: ${correctWords} correct words`,
    canvas.width / 2,
    canvas.height / 2
  );
}

updatedText();
