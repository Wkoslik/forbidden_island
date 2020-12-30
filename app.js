/* notes

1. Generate game board --
2. water level array --
    2.a update to the DOM
3. card constructor --
    3.b build treasure deck (math.random) 
    3.c build flood deck (math.random)
4. function initial flood (flood 6 tiles)
5. player constructor --
6. Player Move function --
    6.a player unflood tile
7. player action
    array to track actions? 
8. player hand array
9. "waters rise" function
    9.a flood deck math.random.unshift into flood deck array
10. player draw two function
11. player hand >5 function --
    11.a player on click removes X number of cards until playerHand.Length < 5
12. Game over function
    12a. if reach end of water level array || if fools landing sinks || if treasure location sinks w/o being collected => player loses
    12.b if player collects treasure, goes to fools landing, and flies off THEN player wins
13. Collect Treasure Function
    13.a if player on tile && if player has 4 treasure cards && if treasure hasn't been collected
*/

console.log("yodel");


//TAKE TWO BUT WITH DIVS

//onclick remove first and then add pilot to tile

//setting up the game
let movement = 85;

//setting up game variables
let waterLevelArray = [2, 2, 3, 3, 3, 4, 4, 5, 5, 6];
let playerHand = [];
let treasureDeck = ['Sandbags', 'Sandbags',
                'Helicopter Lift', 'Helicopter Lift', 'Helicopter Lift', 
                'Earth', 'Earth', 'Earth', 'Earth', 'Earth',
                'Water', 'Water', 'Water', 'Water', 'Water',
                'Fire', 'Fire', 'Fire', 'Fire', 'Fire', 
                'Air', 'Air', 'Air', 'Air', 'Air'];
let watersRiseDeck = ['Waters Rise!', 'Waters Rise!', 'Waters Rise!'];
let islandTurn = true;
let waterLevelIndex = 0;
let playerDraw = 2;
let locationsDiscard = [];
let treasuresDiscard = [];
var pilot = {
    x: 387,
    y: 127,
    element: document.getElementById("pilot")
}
let floodedLocations = []
let locations = [];

//id, flooded(true/false), sunk(true/false), background, name

function CreateLocations(locName, id){
    this.name = locName,
    this.id = id,
    this.flooded = false,
    this.sunk = false,
    this.width = '75px',
    this.height = '75px'
    this.pushToLocations = function() {
        locations.push(this);
    }
    this.pushToLocations();
}

let howlingGarden = new CreateLocations('Howling Garden', 'howlinggarden');
let lostLagoon = new CreateLocations('Lost Lagoon', 'lostlagoon');
let caveOfShadows = new CreateLocations('Cave of Shadows', 'caveofshadows');
let phantomRock = new CreateLocations('Phantom Rock', 'phantomrock');
let silverGate = new CreateLocations('Silver Gate', 'silvergate');
let templeOfTheSun = new CreateLocations('Temple of the Sun', 'templeofthesun');
let watchtower = new CreateLocations('Watchtower', 'watchtower');
let ironGate = new CreateLocations('Iron Gate', 'irongate');
let foolsLanding = new CreateLocations('Fools Landing', 'foolslanding');
let copperGate = new CreateLocations('Copper Gate', 'coppergate');
let coralPalace = new CreateLocations('Coral Palace', 'coralpalace');
let dunesOfDeception = new CreateLocations('Dunes of Deception', 'dunesofdeception');
let goldGate = new CreateLocations('Gold Gate', 'goldgate');
let bronzeGate = new CreateLocations('Bronze Gate', 'bronzegate');
let crimsonForest = new CreateLocations('Crimson Forest', 'crimsonforest');
let observatory = new CreateLocations('Observator', 'observatory');
let tidalPalace = new CreateLocations('Tidal Palace', 'tidalpalace');
let whisperingGarden = new CreateLocations('Whispering Garden', 'whisperinggarden');
let templeOfTheMoon = new CreateLocations('Temple of the Moon', 'templeofthemoon');
let mistyMarsh = new CreateLocations('Misty Marsh', 'mistymarsh');
let twilightHollow = new CreateLocations('Twilight Hollow', 'twilighthollow');
let caveOfEmbers = new CreateLocations('Cave Of Embers', 'caveofembers');
let cliffsOfAbandon = new CreateLocations('Cliffs of Abandon', 'cliffsofabandon');
let breakersBridge = new CreateLocations('Breakers Bridge', 'breakersbridge');


//Shuffle Deck
const shuffleDeck = (deck) =>{
    let currentIndex = deck.length, tempValue, randomIndex;

    while (0 !== currentIndex){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        tempValue = deck[currentIndex];
        deck[currentIndex] = deck[randomIndex];
        deck[randomIndex] = tempValue;
    }

    return deck;

}

//movement with board game boundaries

const movementHandler = (e) => {
    if ((pilot.x === 387 && pilot.y === 127 && e.key === 'w') || 
    (pilot.x === 302 && pilot.y === 42 && e.key === 'w') ||
    (pilot.x === 217 && pilot.y === 42 && e.key === 'w') ||
    (pilot.x === 132 && pilot.y === 127 && e.key === 'w')  ||
    (pilot.x === 47 && pilot.y === 212 && e.key === 'w') ||
    (pilot.x === 472 && pilot.y === 212 && e.key === 'w')) {
        alert("You can't move further North. Try a different direction.")
    } else if ((pilot.x === 472 && pilot.y === 297 && e.key === 's') || 
    (pilot.x === 387 && pilot.y === 382 && e.key === 's') ||
    (pilot.x === 302 && pilot.y === 467 && e.key === 's') ||
    (pilot.x === 217 && pilot.y === 467 && e.key === 's')  ||
    (pilot.x === 132 && pilot.y === 382 && e.key === 's') ||
    (pilot.x === 47 && pilot.y === 297 && e.key === 's')) {
        alert("You can't move further South. Try a different direction.")
    } else if ((pilot.x === 217 && pilot.y === 42 && e.key === 'a') || 
    (pilot.x === 132 && pilot.y === 127 && e.key === 'a') ||
    (pilot.x === 47 && pilot.y === 212 && e.key === 'a') ||
    (pilot.x === 47 && pilot.y === 297 && e.key === 'a')  ||
    (pilot.x === 132 && pilot.y === 382 && e.key === 'a') ||
    (pilot.x === 217 && pilot.y === 467 && e.key === 'a')) {
        alert("You can't move further West. Try a different direction.")
    } else if ((pilot.x === 302 && pilot.y === 42 && e.key === 'd') || 
    (pilot.x === 387 && pilot.y === 127 && e.key === 'd') ||
    (pilot.x === 472 && pilot.y === 212 && e.key === 'd') ||
    (pilot.x === 472 && pilot.y === 297 && e.key === 'd')  ||
    (pilot.x === 387 && pilot.y === 382 && e.key === 'd') ||
    (pilot.x === 302 && pilot.y === 467 && e.key === 'd')) {
        alert("You can't move further East. Try a different direction.")
    } else if (e.key === 'w'){
        pilot.element.style.top = (pilot.y -= movement) + 'px';
        console.log(pilot.x, pilot.y);
    } else if (e.key === 'a'){
        pilot.element.style.left = (pilot.x -= movement) + 'px';
        console.log(pilot.x, pilot.y);
    } else if (e.key === 's'){
        pilot.element.style.top =  (pilot.y += movement) + 'px';
        console.log(pilot.x, pilot.y);
    } else if (e.key ==='d'){
        pilot.element.style.left = (pilot.x += movement) + 'px';
        console.log(pilot.x, pilot.y);
    } else{
        alert("That key won't let you move. Try W, A, S, or D.");
    }
}

document.addEventListener('keydown', movementHandler);

//flood

const flood = () =>{
    if (islandTurn === true){
        drawCards();
        //apply flood class to the tiles tied to the flood cards
        //add a on click even that unfloods the cards to the tiles flooded
    }
}

const drawCards = () => {
    if(islandTurn === true){
    locationsDiscard.push(locations.splice(0,waterLevelArray[waterLevelIndex]));
    } else {
        playerHand.push(treasureDeck.splice(0,2));
    }
}

//randomly assign tiles


const randomTiles = () =>{
    shuffleDeck(locations);
    let element = document.getElementsByClassName('tile');
    for(let i = 0; i < locations.length ; i++){
            if (element[i].id === ""){
                element[i].setAttribute('id', locations[i].id)
            }
        }
    }

const gameSetup = () =>{
    randomTiles();
    //shuffle flood deck
    //flood six tiles
    //shuffle treasure cards
    //two treasure cards to the player
    //push watersrise into treasure deck
    //shuffle treasuredeck
}

gameSetup();


console.log(locations);