/* notes

1. Generate game board
2. water level array
    2.a update to the DOM
3. card constructor
    3.b build treasure deck (math.random)
    3.c build flood deck (math.random)
4. function initial flood (flood 6 tiles)
5. player constructor
6. Player Move function
    6.a player unflood tile
7. player action
    array to track actions? 
8. player hand array
9. "waters rise" function
    9.a flood deck math.random.unshift into flood deck array
10. player draw two function
11. player hand >5 function
    11.a player on click removes X number of cards until playerHand.Length < 5
12. Game over function
    12a. if reach end of water level array || if fools landing sinks || if treasure location sinks w/o being collected => player loses
    12.b if player collects treasure, goes to fools landing, and flies off THEN player wins
13. Collect Treasure Function
    13.a if player on tile && if player has 4 treasure cards && if treasure hasn't been collected
*/

console.log("yodel");

//setting up the game
let game = document.getElementById('game');
let movement = 10;
let ctx =game.getContext('2d');
game.setAttribute('height', getComputedStyle(game)['height']);
game.setAttribute('width', getComputedStyle(game)['width']);

//setting up game variables
let waterLevelArray = [2, 2, 3, 3, 3, 4, 4, 5, 5, 6];
let playerHand = [];

//Shuffle Deck
const shuffleDeck = (deck) =>{
    let currentIndex = deck.length, tempValue, randomIndex;

    //
    while (0 !== currentIndex){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        tempValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = tempValue;
    }

    return deck;

}

//Building Decks

function Deck(y, color, strokeStyle, title){
    this.x = 25, 
    this.y = y, 
    this.width = 175,
    this.height = 100,
    this.color = color,
    this.lineWidth = 10,
    this.text = title
    this.strokeStyle = strokeStyle,
    this.render = function() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.font = '22px sans-serif';
        ctx.fillText(this.text, this.x, this.y - 10, this.y + this.width);
    }
}

let treasureDeck = new Deck(200, 'red', 'red', 'Treasure Deck');
let treasureDiscard = new Deck (340, 'white', 'red', 'Treasure Discard');
let floodDeck = new Deck(550, 'blue', 'blue', 'Flood Deck');
let floodDiscard = new Deck(690, 'white', 'blue', 'Flood Discard');

treasureDeck.render();
treasureDiscard.render();
floodDeck.render();
floodDiscard.render();
