let boxcount = 0;
let rowcount = 0;
let inputWord = "";
let greenbox = 0;
let validWord = true;
let warning = document.getElementsByClassName("warning");
let wordWas = document.getElementsByClassName("lost");
let congo = document.getElementsByClassName("congo");
let guessed = false;
let button = document.getElementsByTagName("button");
let themelight = false;
let fetching = false;
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}
let list_word = [
  "steps",
  "champ",
  "noise",
  "bulky",
  "couch",
  "zaxes",
  "jolly",
  "chyle",
  "denim",
  "given",
  "chain",
  "liver",
  "heart",
  "times",
  "hover",
];
let length = list_word.length;
let randomNumber = getRandomIntInclusive(0, length - 1);
let guessingWord = list_word[randomNumber];
let displayElement = document.getElementsByClassName("word-display")[0];
displayElement.textContent = guessingWord;
function lighttheme() {
  let container = document.getElementsByClassName("container");
  let mainheading = document.getElementsByClassName("mainheading");
  let mainbox = document.getElementsByClassName("mainbox");
  let boxes = document.querySelectorAll(".box");
  let theme = document.getElementsByClassName("theme");
  let reload = document.getElementsByClassName("reload");
  container[0].classList.add("whitebg");
  mainheading[0].classList.add("whitebg", "topblackborder");
  mainbox[0].classList.add("whitebg");
  boxes.forEach((box) => {
    box.classList.add("blackborder", "blacktext");
  });
  theme[0].classList.add("whitebg", "blackborder", "blacktext");
  reload[0].classList.add("whitebg", "blackborder", "blacktext");
  themelight = true;
}
function blacktheme() {
  let container = document.getElementsByClassName("container");
  let mainheading = document.getElementsByClassName("mainheading");
  let mainbox = document.getElementsByClassName("mainbox");
  let boxes = document.querySelectorAll(".box");
  let theme = document.getElementsByClassName("theme");
  let reload = document.getElementsByClassName("reload");
  container[0].classList.remove("whitebg");
  mainheading[0].classList.remove("whitebg", "topblackborder");
  mainbox[0].classList.remove("whitebg");
  boxes.forEach((box) => {
    box.classList.remove("blackborder", "blacktext");
  });
  theme[0].classList.remove("whitebg", "blackborder", "blacktext");
  reload[0].classList.remove("whitebg", "blackborder", "blacktext");
  themelight = false;
}
async function checkWord(word) {
  fetching = true;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (response.ok) {
      validWord = true;
    } else {
      validWord = false;
    }
  } catch (error) {
    console.error("Error connecting to dictionary");
  }
  finally{
    fetching = false;
  }
}
async function displayletter(event) {
  if (rowcount < 6 && guessed == false) {
    let currrow = document.getElementsByClassName("row")[rowcount];
    let box = currrow.getElementsByClassName("box");
    if (event.key.match(/[a-z]/) && event.key.length === 1 && boxcount < 5) {
      box[boxcount].textContent = event.key;
      boxcount++;
      inputWord += event.key;
    }
    if (event.key === "Backspace" && boxcount > 0) {
      boxcount--;
      box[boxcount].textContent = "";
      inputWord = inputWord.slice(0, -1);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (boxcount === 5) {
        if(fetching) return;
        await checkWord(inputWord);
        if (validWord == true) {
          currrow.classList.add("rowAnimation");
          let used = [false, false, false, false, false];
          for (let i = 0; i < 5; i++) {
            if (inputWord[i] == guessingWord[i]) {
              box[i].style.backgroundColor = "green";
              used[i] = true;
              greenbox++;
              if (greenbox == 5) {
                guessed = true;
                congo[0].classList.add("congoAnimation");
                return;
              }
            }
          }
          for (let i = 0; i < 5; i++) {
            if (box[i].style.backgroundColor === "green") continue;
            for (let j = 0; j < 5; j++) {
              if (inputWord[i] == guessingWord[j] && used[j] != true) {
                box[i].style.backgroundColor = "rgb(237, 197, 17)";
              }
            }
          }
          for (let i = 0; i < 5; i++) {
            if (box[i].style.backgroundColor !== "green") {
              if (box[i].style.backgroundColor !== "rgb(237, 197, 17)") {
                box[i].style.backgroundColor = "#5c615cff";
              }
            }
          }
          setTimeout(() => {
            currrow.classList.remove("rowAnimation");
          }, 500);
          boxcount = 0;
          rowcount++;
          inputWord = "";
          greenbox = 0;
          if (rowcount == 6 && !guessed) {
            wordWas[0].classList.add("opacity");
            return;
          }
        } else {
          warning[0].classList.add("opacity");
          currrow.classList.add("invalidAnimation");
          console.log("enter a valid word");
          setTimeout(() => {
            currrow.classList.remove("invalidAnimation");
          }, 500);
          setTimeout(() => {
            warning[0].classList.remove("opacity");
          }, 2000);
        }
      }
    }
  }
}
function changetheme() {
  if (themelight == false) {
    lighttheme();
  } else {
    blacktheme();
  }
}
function reloadpage() {
  location.reload();
}
window.addEventListener("keydown", displayletter);
button[1].addEventListener("click", changetheme);
button[0].addEventListener("click", reloadpage);
