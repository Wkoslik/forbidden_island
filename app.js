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
let islandTurn = false;
let waterLevelIndex = 0;
let playerDraw = 2;
let floodDiscard = [];
let treasuresDiscard = [];
var pilot = {
    x: 387,
    y: 126,
    element: document.getElementById("pilot")
}
let floodHolding;
let sunkLocations = [];
let locations = [];
let playerActions = [];
let playerHandHold = [];


function CreateLocations(locName, id){
    this.name = locName,
    this.id = id,
    this.flooded = false,
    this.sunk = false,
    this.width = 75,
    this.height = 75, 
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
let observatory = new CreateLocations('Observatory', 'observatory');
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
    if ((pilot.x === 385 && pilot.y === 130 && e.key === 'w') || //col4, row 1
    (pilot.x === 300 && pilot.y === 45 && e.key === 'w') ||
    (pilot.x === 215 && pilot.y === 45 && e.key === 'w') ||
    (pilot.x === 130 && pilot.y === 130 && e.key === 'w')  ||
    (pilot.x === 45 && pilot.y === 215 && e.key === 'w') ||
    (pilot.x === 470 && pilot.y === 215 && e.key === 'w')) {
        alert("You can't move further North. Try a different direction.")
    } else if ((pilot.x === 470 && pilot.y === 300 && e.key === 's') || 
    (pilot.x === 385 && pilot.y === 385 && e.key === 's') ||
    (pilot.x === 300 && pilot.y === 470 && e.key === 's') ||
    (pilot.x === 215 && pilot.y === 470 && e.key === 's')  ||
    (pilot.x === 130 && pilot.y === 385 && e.key === 's') ||
    (pilot.x === 45 && pilot.y === 300 && e.key === 's')) {
        alert("You can't move further South. Try a different direction.")
    } else if ((pilot.x === 215 && pilot.y === 45 && e.key === 'a') || 
    (pilot.x === 130 && pilot.y === 130 && e.key === 'a') ||
    (pilot.x === 45 && pilot.y === 215 && e.key === 'a') ||
    (pilot.x === 45 && pilot.y === 300 && e.key === 'a')  ||
    (pilot.x === 130 && pilot.y === 385 && e.key === 'a') ||
    (pilot.x === 215 && pilot.y === 470 && e.key === 'a')) {
        alert("You can't move further West. Try a different direction.")
    } else if ((pilot.x === 300 && pilot.y === 45 && e.key === 'd') || 
    (pilot.x === 385 && pilot.y === 130 && e.key === 'd') ||
    (pilot.x === 470 && pilot.y === 215 && e.key === 'd') ||
    (pilot.x === 470 && pilot.y === 300 && e.key === 'd')  ||
    (pilot.x === 385 && pilot.y === 385 && e.key === 'd') ||
    (pilot.x === 300 && pilot.y === 470 && e.key === 'd')) {
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
    //if it's the islands turn
    if (islandTurn === true){
        //draw cards
        drawCards();
        console.log(floodHolding);
        for(let i = 0; i < floodHolding.length; i++){
            //if the island cards pulled are already flooded
            if(floodHolding[i].flooded === true){
                //sink the location
                floodHolding[i].sunk = true;
                //remove the background image
                document.getElementById(floodHolding[i].id).style.backgroundImage = 'none';
                //change the square to blue so you know the player can't move there
                document.getElementById(floodHolding[i].id).style.backgroundColor = 'blue';
                //push the location to the sunkLocations hand
                sunkLocations.push(floodHolding[i]);
                //remove from floodHolding
            } else { //otherwise
                //switch flooded to true
                floodHolding[i].flooded = true;
                //switch the opacity of the tile to 50%
                document.getElementById(floodHolding[i].id).style.opacity = '50%';
                //add the class 'flooded'
                document.getElementById(floodHolding[i].id).classList.add = 'flooded';
                //add an event listener to unflood
                document.getElementById(floodHolding[i].id).addEventListener('click', unflood());
                //push from floodHolding into flood discard
                floodDiscard.push(floodHolding[i]);
                //remove from flood holding
            }
        }
        islandTurn = false;
    } else {
        shuffleDeck(locations);
        floodHolding = locations.splice(0,6);
        for(let i = 0; i < 6; i++){
            //switch flooded to true
            floodHolding[i].flooded = true;
            //switch the opacity of the tile to 50%
            document.getElementById(floodHolding[i].id).style.opacity = '50%';
            //add the class 'flooded'
            document.getElementById(floodHolding[i].id).classList.add('flooded');
            //add an event listener to unflood
            document.getElementById(floodHolding[i].id).addEventListener('click', unflood);
            //push from floodHolding into flood discard
            floodDiscard.push(floodHolding[i]);
        }
    }
    floodHolding.length = 0;
}

//unflood

const unflood = (e) =>{
    var id = e.srcElement.id;
    var combinedLocations = [locations, floodDiscard];
    var eventLoc = document.getElementById(id);

   //if the location clicked is not NSEW of the player, reject the click.

    if(((eventLoc.offsetTop === (pilot.y - 25 + 85)) && (eventLoc.offsetLeft === pilot.x - 25)) || //immediately south
        ((eventLoc.offsetTop === (pilot.y - 25 )-85) && (eventLoc.offsetLeft === pilot.x - 25)) || //north
        ((eventLoc.offsetLeft === (pilot.x - 25 )-85) && (eventLoc.offsetTop === pilot.y-25)) || //west
        ((eventLoc.offsetLeft === (pilot.x - 25 )+85) && (eventLoc.offsetTop === pilot.y-25)) || // east
        ((eventLoc.offsetTop === (pilot.y - 25)) && (eventLoc.offsetLeft === pilot.x - 25))){ //tile their on
            document.getElementById(id).classList.remove('flooded');
            document.getElementById(id).style.opacity = '100%';
            document.getElementById(id).removeEventListener('click', unflood);
            
            //switch locations from flooded = true to flooded = false
            for(let i = 0; i<combinedLocations.length; i++){
                for(let j = 0; j < combinedLocations[i].length; j++){
                    if(combinedLocations[i][j].id = id){
                        combinedLocations[i][j].flooded = false
                    } else{
                        return;
                        }
                    }
                }
        } else{
            console.log('Nope');
            return;
    }
}

//Draw cards
const drawCards = () => {
    //if it's the island's turn
    if(islandTurn === true){
        //push number of cards equal to water level array into flood holding
    floodHolding.push(locations.splice(0,waterLevelArray[waterLevelIndex]));
    } else {
        //otherwise, push 2 cards into the player hand
        playerHandHold.push(treasureDeck[0], treasureDeck[1]);
        treasureDeck.shift();
        treasureDeck.shift();
        //if playerHandHold contains 'waters rise
            //increase waters rise array by 1
            //send waters rise to treasure discard
                //treasureDiscard.push(the waters rise card;
            //send non-waters rise card to player hand
                //playerHand.push(the remaining card);
            //shuffle the flood discard deck    
                //shuffleDeck(floodDiscard)
            //push the flood discard deck to the top of the flood deck
                //floodDeck.push(for(let i = 0; i<floodDiscard.length; i++){floodDiscard[i]};)
            //clear the flood discard deck
                //floodDiscard = [];
            //clear the player hand hold array
                //playerHandHold = [];
    }
}

//update x and y values for locations

const updateXAndY = () =>{
    for(let i = 0; i < locations.length; i++){
        locations[i].x = document.getElementById(locations[i].id).offsetLeft;
        locations[i].y = document.getElementById(locations[i].id).offsetTop;
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
    //randomly generate board
    randomTiles();
    //update the x and y value of the locations;
    updateXAndY();
    //randomly flood 6 tiles
    flood();
    //shuffle treasure cards
    /*shuffleDeck(treasureDeck);
    //two treasure cards to the player
    drawCards();? might need to do a different idea.
    //push watersrise into treasure deck
    treasureDeck.push(watersRiseDeck);
    treasureDeck.push(watersRiseDeck);
    treasureDeck.push(watersRiseDeck);
    //shuffle treasuredeck(three times for good measure)
    shuffleDeck(treasureDeck);
    shuffleDeck(treasureDeck);
    shuffleDeck(treasureDeck);*/
}


gameSetup();



//update Pilot X and Y to be on top of Fools Landing

const playerXAndY = () =>{
    document.getElementById('pilot').style.left = (foolsLanding.x + 37.5 - 12.5) + 'px';
    document.getElementById('pilot').style.top = (foolsLanding.y + 37.5 - 12.5) + 'px';
    pilot.x = foolsLanding.x + 37.5 - 12.5;
    pilot.y = foolsLanding.y + 37.5 - 12.5;
}

playerXAndY();

//player turn 

const playerTurn = () =>{
    //if player.x or player.y changes, push 'movement' to playerActions
    //if player unfloods tile, push 'shore up' to player actions
    //if player exchanges cards for a treasure, push 'exchange' to playerActions
    //if playerActions.length = 3, then 
    //drawCard()
}

//if draw deck is empty

const emptyDeck = (deck, draw) => {
    if (deck.length < draw){

    }
}

//display drawn cards
    // treasure cards
    // flood cards

//player skip turn button
//player discard card buttons
//exchange treasure card button
    //if on the right tile && has 4 of the same card
//treasuresCollected = 0;
//treasure icon? 
//treasures to collect
//if waters rise, then waters rise index ++
//win condition
    //fly away button
//lose condition
//helper text