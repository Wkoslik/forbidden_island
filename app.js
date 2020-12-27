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
let locations = ['Howling Garden', 'Lost Lagoon', 'Cave of Shadows', 'Phantom Rock', 
                'Silver Gate', 'Temple of the Sun', 'Watchtower', 'Iron Gate', 
                'Fools Landing', 'Copper Gate', 'Coral Palace', 'Dunes of Deception', 
                'Gold Gate', 'Bronze Gate', 'Crimson Forest', 'Observatory', 
                'Tidal Palace', 'Whispering Garden', 'Temple of the Moon', 'Misty Marsh',
                'Twilight Hollow', 'Cave of Embers', 'Cliffs of Abandon', 'Breakers Bridge'];

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
    this.width = 250,
    this.height = 125,
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
        ctx.fillText(this.text, this.x, this.y - 10, this.x + this.width);
    }
}

let treasureDeck = new Deck(100, 'red', 'red', 'Treasure Deck');
let treasureDiscard = new Deck (260, 'white', 'red', 'Treasure Discard');
let floodDeck = new Deck(420, 'blue', 'blue', 'Flood Deck');
let floodDiscard = new Deck(580, 'white', 'blue', 'Flood Discard');

treasureDeck.render();
treasureDiscard.render();
floodDeck.render();
floodDiscard.render();


//Building the Board

function Board(x, y, fillColor, textColor, text){
    this.x = x, 
    this.y = y, 
    this.width = 75, 
    this.height = 75, 
    this.color = fillColor, 
    this.strokeStyle = textColor, 
    this.text = text, 
    this.render = function() {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = '16px sans-serif';
        ctx.strokeText(this.text, this.x + 5, this.y + 42, this.width -10);
    }
}

let q = 85;
let row1 = 25;
let col3 = 660;
let col2 = col3 - q;
let col1 = col2 - q;
let col4 = col3+q;
let col5 = col4+q;
let col6 = col5+q;
let row2 = row1 + q;
let row3 = row2 + q;
let row4 = row3 + q;
let row5 = row4 + q;
let row6 = row5 + q;

let howlingGarden = new Board(col3, row1, 'white', 'black', locations[0]);
let lostLagoon = new Board(col4, row1, 'white', 'black', locations[1]);

let caveOfShadows = new Board(col2, row2, 'white', 'black', locations[2]);
let phantomRock = new Board(col3, row2, 'white', 'black', locations[3]);
let silverGate = new Board(col4, row2, 'white', 'black', locations[4]);
let templeOfTheSun = new Board(col5, row2, 'white', 'black', locations[5]);

let watchtower = new Board(col1, row3, 'white', 'black', locations[6]);
let ironGate = new Board(col2, row3, 'white', 'black', locations[7]);
let foolsLanding = new Board(col3, row3, 'white', 'black', locations[8]);
let copperGate = new Board(col4, row3, 'white', 'black', locations[9]);
let coralPalace = new Board(col5, row3, 'white', 'black', locations[10]);
let dunesOfDeception = new Board(col6, row3, 'white', 'black', locations[11]);

let goldGate = new Board(col1, row4, 'white', 'black', locations[12]);
let bronzeGate = new Board(col2, row4, 'white', 'black', locations[13]);
let crimsonForest = new Board(col3, row4, 'white', 'black', locations[14]);
let observatory = new Board(col4, row4, 'white', 'black', locations[15]);
let tidalPalace = new Board(col5, row4, 'white', 'black', locations[16]);
let whisperingGarden = new Board(col6, row4, 'white', 'black', locations[17]);

let templeOfTheMoon = new Board(col2, row5, 'white', 'black', locations[18]);
let mistyMarsh = new Board(col3, row5, 'white', 'black', locations[19]);
let twilightHollow = new Board(col4, row5, 'white', 'black', locations[20]);
let caveOfEmbers = new Board(col5, row5, 'white', 'black', locations[21]);

let cliffsOfAbandon = new Board(col3, row6, 'white', 'black', locations[22]);
let breakersBridge = new Board(col4, row6, 'white', 'black', locations[23]);


howlingGarden.render();
lostLagoon.render();
caveOfShadows.render();
phantomRock.render();
silverGate.render();
templeOfTheSun.render();
watchtower.render();
ironGate.render();
foolsLanding.render();
copperGate.render();
coralPalace.render();
dunesOfDeception.render();
goldGate.render();
bronzeGate.render();
crimsonForest.render();
observatory.render();
tidalPalace.render();
whisperingGarden.render();
templeOfTheMoon.render();
mistyMarsh.render();
twilightHollow.render();
caveOfEmbers.render();
cliffsOfAbandon.render();
breakersBridge.render();
