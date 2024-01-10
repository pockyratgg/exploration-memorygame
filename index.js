//creating cards and setting score to 0. creating first card and second card holds the cards we're going to compare
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

//starting with updating score
document.querySelector(".score").textContent = score;

//initializing cards
fetch("./data/cards.json")
.then((res) => res.json())
.then((data) => {
    cards = [...data, ...data]; //done twice because its for two cards
    shuffleCards();
    generateCards();
});

//for shuffling we use the fisher-yates shuffle algorithm. start by declaring variables, loops through array back to front starting with the last element.  temporary value is needed when we assign second value to the first one, we lose it so it needs to be in a temporary variable
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

//uses 'for of loop' to loop over the cards. uses data in the json file to compare the data for cards. using template literals allows us to use javascript variables inside of strings. cleaner than concatenating strings
function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image}> 
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
        //console.log("where's the slash coming from" + card.image); LINE ADDED WITH TONY TO DEBUG issue where card images weren't linked correctly.
    }
}

// flipcard function. first checks if board is locked or not, then returns and doesn't do anything. if first card is, we don't do anything and return. adds flip class, locks the board by setting it to true 
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
} //end of flipCard function

//checkForMatch function is easy and compares data between first and second cards by looking at the data name attributes. if the name is equal, then we have a match
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}  //end of checkformatch function

//after user clicks on two cards, add one point per match, and just removed click listener for other cards so nothing happens
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    score++;
    document.querySelector(".score").textContent = score;

    resetBoard(); //function will write out later just keep for now
} 

//removes flipped classes from cards, unflip them, and then reset the board. set time out is 1000 which delays function 1 second which makes sure animation has time to complete
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

//restart board function
function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
}