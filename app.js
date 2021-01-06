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

//setting up the game
let movement = 85;
let waterLevelArray = [2, 2, 3, 3, 3, 4, 4, 5, 5, 6];
let playerHand = [];
let treasureDeck = [];
let watersRiseDeck = [];
let islandTurn = false;
let waterLevelIndex = 0;
let playerDraw = 2;
let floodDiscard = [];
let treasuresDiscard = [];
let treasureDiscardDOM = document.getElementById("treasurediscard");
var pilot = {
  x: 387,
  y: 126,
  element: document.getElementById("pilot"),
  hand: []
};
let floodHolding = [];
let sunkLocations = [];
let locations = [];
let playerActions = 0;
let playerHandHold = [];
let progressBar = document.getElementById("progressbar");
let progressBarValue = 5;
let offset = 25;
let treasureCount = 0;
let treasureGoal = 4;
let earthTreasureCollected = false;
let waterTreasureCollected = false;
let fireTreasureCollected = false;
let airTreasureCollected = false;
let pilotDomLeft = document.getElementById("pilot").style.left;
let pilotDomTop = document.getElementById("pilot").style.top;

//Create Locations constructor --
//this creates all of the locations on the game board
function CreateLocations(locName, id, treasure) {
  (this.name = locName),
    (this.id = id),
    (this.className = id),
    (this.treasure = treasure),
    (this.flooded = false),
    (this.sunk = false),
    (this.width = 75),
    (this.height = 75),
    (this.isLocation = true),
    (this.pushToLocations = function () {
      locations.push(this);
    });
  this.pushToLocations();
}

//render locations
let howlingGarden = new CreateLocations(
  "Howling Garden",
  "howlinggarden",
  "airtreasure"
);
let lostLagoon = new CreateLocations("Lost Lagoon", "lostlagoon", "");
let caveOfShadows = new CreateLocations(
  "Cave of Shadows",
  "caveofshadows",
  "firetreasure"
);
let phantomRock = new CreateLocations("Phantom Rock", "phantomrock", "");
let silverGate = new CreateLocations("Silver Gate", "silvergate", "");
let templeOfTheSun = new CreateLocations(
  "Temple of the Sun",
  "templeofthesun",
  "earthtreasure"
);
let watchtower = new CreateLocations("Watchtower", "watchtower", "");
let ironGate = new CreateLocations("Iron Gate", "irongate", "");
let foolsLanding = new CreateLocations("Fools Landing", "foolslanding", "");
let copperGate = new CreateLocations("Copper Gate", "coppergate", "");
let coralPalace = new CreateLocations(
  "Coral Palace",
  "coralpalace",
  "watertreasure"
);
let dunesOfDeception = new CreateLocations(
  "Dunes of Deception",
  "dunesofdeception",
  ""
);
let goldGate = new CreateLocations("Gold Gate", "goldgate", "");
let bronzeGate = new CreateLocations("Bronze Gate", "bronzegate", "");
let crimsonForest = new CreateLocations("Crimson Forest", "crimsonforest", "");
let observatory = new CreateLocations("Observatory", "observatory", "");
let tidalPalace = new CreateLocations(
  "Tidal Palace",
  "tidalpalace",
  "watertreasure"
);
let whisperingGarden = new CreateLocations(
  "Whispering Garden",
  "whisperinggarden",
  "airtreasure"
);
let templeOfTheMoon = new CreateLocations(
  "Temple of the Moon",
  "templeofthemoon",
  "earthtreasure"
);
let mistyMarsh = new CreateLocations("Misty Marsh", "mistymarsh", "");
let twilightHollow = new CreateLocations(
  "Twilight Hollow",
  "twilighthollow",
  ""
);
let caveOfEmbers = new CreateLocations(
  "Cave Of Embers",
  "caveofembers",
  "firetreasure"
);
let cliffsOfAbandon = new CreateLocations(
  "Cliffs of Abandon",
  "cliffsofabandon",
  ""
);
let breakersBridge = new CreateLocations(
  "Breakers Bridge",
  "breakersbridge",
  ""
);

let treasurePickupLocations = [
  howlingGarden,
  whisperingGarden,
  templeOfTheSun,
  templeOfTheMoon,
  caveOfShadows,
  caveOfEmbers,
  tidalPalace,
  coralPalace
];

//CreateTreasures Constructor
//This creates the treasures deck
function CreateTreasuresDeck(cardName, id) {
  (this.name = cardName),
    (this.className = id),
    (this.id = id),
    (this.pushToTreasureDeck = function () {
      treasureDeck.push(this);
    });
  this.pushToTreasureDeck();
}

//render treasure deck
let chalice1 = new CreateTreasuresDeck("chalice", "water");
let chalice2 = new CreateTreasuresDeck("chalice", "water");
let chalice3 = new CreateTreasuresDeck("chalice", "water");
let chalice4 = new CreateTreasuresDeck("chalice", "water");
let chalice5 = new CreateTreasuresDeck("chalice", "water");

let lion1 = new CreateTreasuresDeck("lion", "air");
let lion2 = new CreateTreasuresDeck("lion", "air");
let lion3 = new CreateTreasuresDeck("lion", "air");
let lion4 = new CreateTreasuresDeck("lion", "air");
let lion5 = new CreateTreasuresDeck("lion", "air");

let fire1 = new CreateTreasuresDeck("fire", "fire");
let fire2 = new CreateTreasuresDeck("fire", "fire");
let fire3 = new CreateTreasuresDeck("fire", "fire");
let fire4 = new CreateTreasuresDeck("fire", "fire");
let fire5 = new CreateTreasuresDeck("fire", "fire");

let earth1 = new CreateTreasuresDeck("earth", "earth");
let earth2 = new CreateTreasuresDeck("earth", "earth");
let earth3 = new CreateTreasuresDeck("earth", "earth");
let earth4 = new CreateTreasuresDeck("earth", "earth");
let earth5 = new CreateTreasuresDeck("earth", "earth");

let sandbag1 = new CreateTreasuresDeck("sandbag", "sandbag");
let sandbag2 = new CreateTreasuresDeck("sandbag", "sandbag");

let helicopterLift1 = new CreateTreasuresDeck(
  "helicopter lift",
  "helicopterlift"
);
let helicopterLift2 = new CreateTreasuresDeck(
  "helicopter lift",
  "helicopterlift"
);
let helicopterLift3 = new CreateTreasuresDeck(
  "helicopter lift",
  "helicopterlift"
);

//CreateWatersRise Constructor
//This creates the treasures deck
function CreateWatersRise(cardName, id) {
  (this.name = cardName),
    (this.className = id),
    (this.pushToWatersRiseDeck = function () {
      watersRiseDeck.push(this);
    });
  this.pushToWatersRiseDeck();
}
let watersrise1 = new CreateWatersRise("waters rise", "watersrise");

/* HELPER FUNCTIONS */

const reload = () => {
  location.reload();
  return false;
};

//loss condition

const youLose = () => {
  if (
    progressBarValue === 100 ||
    foolsLanding.sunk === true ||
    (airTreasureCollected === false &&
      howlingGarden.sunk === true &&
      whisperingGarden.sunk === true) ||
    (waterTreasureCollected === false &&
      tidalPalace.sunk === true &&
      coralPalace.sunk === true) ||
    (earthTreasureCollected === false &&
      templeOfTheMoon.sunk === true &&
      templeOfTheSun.sunk === true) ||
    (fireTreasureCollected === false &&
      caveOfEmbers.sunk === true &&
      caveOfShadows.sunk === true)
  ) {
    document.getElementById("game").style.backgroundColor = "red";
    document.getElementById("game").innerText = "You Lost!";
    document.getElementById("game").style.color = "white";
    document.getElementById("game").style.fontSize = "64px";
    document.getElementById("game").style.fontFamily = "Fredericka the Great";
    document.getElementById("playeractions").style.display = "none";
    document.getElementById("playerhand").style.display = "none";
    document.getElementById("drawtreasurecards").innerText = "Restart Game";
    document
      .getElementById("drawtreasurecards")
      .removeEventListener("click", playerDeckDraw);
    document
      .getElementById("drawtreasurecards")
      .addEventListener("click", reload);
    clearInterval(playerTurn);
    clearInterval(collectTreasuresBtn);
    clearInterval(checkPlayerHandLimit);
    clearInterval(youWin);
  }
};

//Shuffle Deck
const shuffleDeck = (deck) => {
  let currentIndex = deck.length,
    tempValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    tempValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = tempValue;
  }

  return deck;
};

//discard
const discard = (e) => {
  //identify discard button that was clicked and find it's parent element(the card itself) with an array of classes
  let eventLocation = e.srcElement.parentElement.classList[0];
  let pilotHand = pilot.hand;
  //
  const isEventLocation = (location) => location.className === eventLocation;
  let index = pilot.hand.findIndex(isEventLocation);
  treasuresDiscard.push(pilot.hand[index]);
  pilotHand.splice(index, 1);
  e.srcElement.parentElement.remove();
  e.srcElement.remove();
  //remove previous classname from div
  treasureDiscardDOM.classList = "";
  //add new class name
  treasureDiscardDOM.classList.add(eventLocation);
};

//draw flood cards

const drawFloodCards = () => {
  let locationsLength = locations.length;

  if (locationsLength >= waterLevelArray[waterLevelIndex]) {
    //push locations we're flooding into the flood holding array.
    for (let i = 0; i < waterLevelArray[waterLevelIndex]; i++) {
      floodHolding.push(locations[i]);
    }
    //remove locations from the locations array.
    locations.splice(0, waterLevelArray[waterLevelIndex]);
  } else if (locationsLength > 0) {
    let difference = waterLevelArray[waterLevelIndex] - locationsLength;
    for (let i = 0; i < locationsLength; i++) {
      floodHolding.push(locations[i]);
    }
    locations.splice(0, locationsLength);
    shuffleDeck(floodDiscard);
    locations = floodDiscard;
    floodDiscard = [];
    for (let i = 0; i < difference; i++) {
      floodHolding.push(locations[i]);
    }
    locations.splice(0, difference);
  } else {
    shuffleDeck(floodDiscard);
    locations = floodDiscard;
    floodDiscard = [];
    //push locations we're flooding into the flood holding array.
    for (let i = 0; i < waterLevelArray[waterLevelIndex]; i++) {
      floodHolding.push(locations[i]);
    }
    //remove locations from the locations array.
    locations.splice(0, waterLevelArray[waterLevelIndex]);
  }
};

//movement with board game boundaries **REFACTOR** If currentlocation +movement > upper boundary then no movement

const movementHandler = (e) => {
  //cannot move to sunk locations
  for (let i = 0; i < sunkLocations.length; i++) {
    if (
      pilot.x - offset === sunkLocations[i].x &&
      pilot.y - offset + movement === sunkLocations[i].y &&
      e.key === "s"
    ) {
      alert("You cannot move to a sunk location.");
      return;
    } else if (
      pilot.x - offset === sunkLocations[i].x &&
      pilot.y - offset - movement === sunkLocations[i].y &&
      e.key === "w"
    ) {
      alert("You cannot move to a sunk location.");
      return;
    } else if (
      pilot.x - offset - movement === sunkLocations[i].x &&
      pilot.y - offset === sunkLocations[i].y &&
      e.key === "a"
    ) {
      alert("You cannot move to a sunk location.");
      return;
    } else if (
      pilot.x - offset + movement === sunkLocations[i].x &&
      pilot.y - offset === sunkLocations[i].y &&
      e.key === "d"
    ) {
      alert("You cannot move to a sunk location.");
      return;
    }
  }

  if (
    (pilot.x === 385 && pilot.y === 130 && e.key === "w") || //col4, row 1
    (pilot.x === 300 && pilot.y === 45 && e.key === "w") ||
    (pilot.x === 215 && pilot.y === 45 && e.key === "w") ||
    (pilot.x === 130 && pilot.y === 130 && e.key === "w") ||
    (pilot.x === 45 && pilot.y === 215 && e.key === "w") ||
    (pilot.x === 470 && pilot.y === 215 && e.key === "w")
  ) {
    alert("You can't move further North. Try a different direction.");
  } else if (
    (pilot.x === 470 && pilot.y === 300 && e.key === "s") ||
    (pilot.x === 385 && pilot.y === 385 && e.key === "s") ||
    (pilot.x === 300 && pilot.y === 470 && e.key === "s") ||
    (pilot.x === 215 && pilot.y === 470 && e.key === "s") ||
    (pilot.x === 130 && pilot.y === 385 && e.key === "s") ||
    (pilot.x === 45 && pilot.y === 300 && e.key === "s")
  ) {
    alert("You can't move further South. Try a different direction.");
  } else if (
    (pilot.x === 215 && pilot.y === 45 && e.key === "a") ||
    (pilot.x === 130 && pilot.y === 130 && e.key === "a") ||
    (pilot.x === 45 && pilot.y === 215 && e.key === "a") ||
    (pilot.x === 45 && pilot.y === 300 && e.key === "a") ||
    (pilot.x === 130 && pilot.y === 385 && e.key === "a") ||
    (pilot.x === 215 && pilot.y === 470 && e.key === "a")
  ) {
    alert("You can't move further West. Try a different direction.");
  } else if (
    (pilot.x === 300 && pilot.y === 45 && e.key === "d") ||
    (pilot.x === 385 && pilot.y === 130 && e.key === "d") ||
    (pilot.x === 470 && pilot.y === 215 && e.key === "d") ||
    (pilot.x === 470 && pilot.y === 300 && e.key === "d") ||
    (pilot.x === 385 && pilot.y === 385 && e.key === "d") ||
    (pilot.x === 300 && pilot.y === 470 && e.key === "d")
  ) {
    alert("You can't move further East. Try a different direction.");
  } else if (e.key === "w") {
    pilot.element.style.top = (pilot.y -= movement) + "px";
    playerActions++;
  } else if (e.key === "a") {
    pilot.element.style.left = (pilot.x -= movement) + "px";
    playerActions++;
  } else if (e.key === "s") {
    pilot.element.style.top = (pilot.y += movement) + "px";
    playerActions++;
  } else if (e.key === "d") {
    pilot.element.style.left = (pilot.x += movement) + "px";
    playerActions++;
  } else {
    alert("That key won't let you move. Try W, A, S, or D.");
  }
};

document.addEventListener("keydown", movementHandler);

//prevent clicks if players turn is over

const clickBlock = () => {
  document.getElementById("game").style.pointerEvents = "none";
  document.removeEventListener("keydown", movementHandler);
};

//remove block on clicks and key presses

const removeBlock = () => {
  document.addEventListener("keydown", movementHandler);
  document.getElementById("game").style.pointerEvents = "auto";
};

//check player hand limit
const handOverFive = () => {
  document.getElementById("cardlimit").style.display = "block";
  document.getElementById("endturn").removeEventListener("click", endTurn);
};

const checkPlayerHandLimit = () => {
  if (pilot.hand.length > 5) {
    clickBlock();
    handOverFive();
  } else {
    document.getElementById("endturn").addEventListener("click", endTurn);
    document.getElementById("cardlimit").style.display = "none";
  }
};

const activeHandChecking = setInterval(checkPlayerHandLimit, 100);

//unflood with sandbag
const unfloodSandbag = (e) => {
  var id = e.srcElement.id;
  var combinedLocations = [locations, floodDiscard];
  let tiles = document.getElementsByClassName("tile");

  document.getElementById(id).classList.remove("flooded");
  document.getElementById(id).style.opacity = "100%";
  document.getElementById(id).removeEventListener("click", unflood);

  //switch locations from flooded = true to flooded = false
  for (let i = 0; i < combinedLocations.length; i++) {
    for (let j = 0; j < combinedLocations[i].length; j++) {
      if (combinedLocations[i][j].id === id) {
        combinedLocations[i][j].flooded = false;
      }
    }
  }
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].removeEventListener("click", unfloodSandbag);
  }
};

//get x and y
const getXY = (e) => {
  var id = e.srcElement.id;
  var tiles = document.getElementsByClassName("tile");
  var combinedLocations = [locations, floodDiscard];
  var x;
  var y;

  for (let j = 0; j < combinedLocations.length; j++) {
    for (let k = 0; k < combinedLocations[j].length; k++) {
      if (combinedLocations[j][k].id === id) {
        x = combinedLocations[j][k].x;
        y = combinedLocations[j][k].y;
      }
    }
  }

  pilot.x = x + offset;
  pilot.y = y + offset;
  document.getElementById("pilot").style.left = pilot.x + "px";
  document.getElementById("pilot").style.top = pilot.y + "px";

  //move player without adding to playeraction array
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].removeEventListener("click", getXY);
  }
};

//useHelicopterLift
const useHelicopterLift = (e) => {
  removeBlock();

  let tiles = document.getElementsByClassName("tile");
  //move player without adding to playeraction array
  for (let i = 0; i < tiles.length; i++) {
    document.getElementsByClassName("tile")[i].addEventListener("click", getXY);
  }

  //send card to discard
  let eventLocation = e.srcElement.parentElement.classList[0];
  const isEventLocation = (location) => location.className === eventLocation;
  let index = pilot.hand.findIndex(isEventLocation);
  pilot.hand.splice(index, 1);
  e.srcElement.parentElement.remove();
  e.srcElement.remove();
  //remove previous classname from div
  treasureDiscardDOM.classList = "";
  //add new class name
  treasureDiscardDOM.classList.add(eventLocation);
};

//useSandbag

const useSandbag = (e) => {
  removeBlock();

  let tiles = document.getElementsByClassName("tile");
  //move player without adding to playeraction array
  for (let i = 0; i < tiles.length; i++) {
    document
      .getElementsByClassName("tile")
      [i].addEventListener("click", unfloodSandbag);
  }

  //send card to discard
  let eventLocation = e.srcElement.parentElement.classList[0];
  const isEventLocation = (location) => location.className === eventLocation;
  let index = pilot.hand.findIndex(isEventLocation);
  pilot.hand.splice(index, 1);
  e.srcElement.parentElement.remove();
  e.srcElement.remove();
  //remove previous classname from div
  treasureDiscardDOM.classList = "";
  //add new class name
  treasureDiscardDOM.classList.add(eventLocation);
};

const treasureDeckDraw = () => {
  if (treasureDeck.length >= 2) {
    //push 2 cards into the playerhandhold array
    playerHandHold.push(treasureDeck[0], treasureDeck[1]);
    //remove first two cards from
    treasureDeck.shift();
    treasureDeck.shift();
  } else if (treasureDeck.length === 1) {
    playerHandHold.push(treasureDeck[0]);
    treasureDeck.shift();
    shuffleDeck(treasuresDiscard);
    treasureDeck = treasuresDiscard;
    treasuresDiscard = [];
    //remove previous classname from div
    treasureDiscardDOM.classList = "";
  } else {
    shuffleDeck(treasuresDiscard);
    treasureDeck = treasuresDiscard;
    treasuresDiscard = [];
    //remove previous classname from div
    treasureDiscardDOM.classList = "";
  }

  for (let i = 0; i < 2; i++) {
    if (playerHandHold[i].className === "watersrise") {
      //increase waterlevel index
      waterLevelIndex++;
      //increase progress bar
      if (progressBarValue === 85) {
        progressBarValue += 15;
      } else {
        progressBarValue += 10;
      }
      progressBar.value = progressBarValue;
      //move waters rise card to treasure discard
      treasuresDiscard.unshift(playerHandHold[i]);
      //remove previous classname from div
      treasureDiscardDOM.classList = "";
      //add new class name
      treasureDiscardDOM.classList.add("watersrise");
      //shuffle flood discard
      if (floodDiscard.length > 0) {
        shuffleDeck(floodDiscard);
        //add flood discard to front of flood pile
        for (let i = 0; i < floodDiscard.length; i++) {
          locations.unshift(floodDiscard[i]);
        }
      }
      //empty flood discard
      floodDiscard = [];
    } else {
      //push card to player hand
      pilot.hand.push(playerHandHold[i]);
      //create a new div
      let newDiv = document.createElement("div");
      //add class name to new div
      newDiv.classList.add(playerHandHold[i].className);
      //add newDiv to treasurehand div
      document.getElementById("treasurehand").appendChild(newDiv);
      //create button
      let button = document.createElement("button");
      //add function to button
      button.addEventListener("click", discard);
      button.classList.add("discard");
      button.innerText = "Discard";
      newDiv.appendChild(button);
      //if playerhandhold[i].classname == sandbag || helcopterlift add a button
      if (
        playerHandHold[i].className === "sandbag" ||
        playerHandHold[i].className === "helicopterlift"
      ) {
        let secondBtn = document.createElement("button");
        newDiv.appendChild(secondBtn);
        if (playerHandHold[i].className === "sandbag") {
          secondBtn.addEventListener("click", useSandbag);
          secondBtn.classList.add("usesandbag");
          secondBtn.innerText = "Use at any time";
        } else {
          secondBtn.addEventListener("click", useHelicopterLift);
          secondBtn.classList.add("usehelicopter");
          secondBtn.innerText = "Use at any time";
        }
      }
    }
  }
  //empty playerHandHold
  playerHandHold = [];
};

const youWin = () => {
  let helicopterCount = 0;

  //figure out how many helicopter lifts the player has in hand
  for (let i = 0; i < pilot.hand.length; i++) {
    if (pilot.hand[i].className === "helicopterlift") {
      helicopterCount++;
    }
  }

  //if treasure ===1 && player on fools landing && player has helicopter lift
  if (
    treasureCount >= treasureGoal &&
    pilot.x === foolsLanding.x + offset &&
    pilot.y === foolsLanding.y + offset &&
    helicopterCount >= 1
  ) {
    document.getElementById("game").style.backgroundColor = "blue";
    document.getElementById("game").innerText = "You Won!";
    document.getElementById("game").style.color = "white";
    document.getElementById("game").style.fontSize = "64px";
    document.getElementById("game").style.fontFamily = "Fredericka the Great";
    document.getElementById("playeractions").style.display = "none";
    document.getElementById("playerhand").style.display = "none";
    document.getElementById("drawtreasurecards").innerText = "Restart Game";
    document
      .getElementById("drawtreasurecards")
      .removeEventListener("click", playerDeckDraw);
    document
      .getElementById("drawtreasurecards")
      .addEventListener("click", reload);
    clearInterval(playerTurn);
    clearInterval(collectTreasuresBtn);
    clearInterval(checkPlayerHandLimit);
    clearInterval(youLose);
  }
};

setInterval(youWin, 1000);
//flood

const flood = () => {
  //if it's the islands turn
  if (islandTurn === true) {
    //draw cards --> push locations we're flooding to teh flood holding array and then remove the locations from the locations array
    drawFloodCards();
    //loop through flood holding
    for (let i = 0; i < floodHolding.length; i++) {
      //if the island cards pulled are already flooded
      if (floodHolding[i].flooded === true) {
        //sink the location
        floodHolding[i].sunk = true;
        //remove the background image
        document.getElementById(floodHolding[i].id).style.backgroundImage =
          "none";
        //change the square to blue so you know the player can't move there
        document.getElementById(floodHolding[i].id).style.backgroundColor =
          "blue";
        //push the location to the sunkLocations hand
        sunkLocations.push(floodHolding[i]);
      } else {
        //otherwise
        //switch flooded to true
        floodHolding[i].flooded = true;
        //switch the opacity of the tile to 50%
        document.getElementById(floodHolding[i].id).style.opacity = "50%";
        //add the class 'flooded'
        document.getElementById(floodHolding[i].id).classList.add = "flooded";
        //add an event listener to unflood
        document
          .getElementById(floodHolding[i].id)
          .addEventListener("click", unflood);
        //push from floodHolding into flood discard
        floodDiscard.push(floodHolding[i]);
        //remove previous class
        if (i === floodHolding.length - 1) {
          document.getElementById("flooddiscard").classList = "";
          document
            .getElementById("flooddiscard")
            .classList.add(floodHolding[i].className);
        }
      }
    }
    floodHolding = [];
    islandTurn = false;
    //if not the island turn (GAME SET UP)
  } else {
    //shuffle locations deck
    shuffleDeck(locations);
    //move first 6 locations into flood holding
    for (let j = 0; j < 6; j++) {
      floodHolding.push(locations[j]);
    }
    //remove the first 6 locations from the locations deck
    for (let j = 0; j < 6; j++) {
      locations.shift();
    }
    //loop through flood holding to flood tiles
    for (let i = 0; i < 6; i++) {
      //switch flooded to true
      floodHolding[i].flooded = true;
      //switch the opacity of the tile to 50%
      document.getElementById(floodHolding[i].id).style.opacity = "50%";
      //add the class 'flooded'
      document.getElementById(floodHolding[i].id).classList.add("flooded");
      //add an event listener to unflood
      document
        .getElementById(floodHolding[i].id)
        .addEventListener("click", unflood);
      //push from floodHolding into flood discard
      floodDiscard.push(floodHolding[i]);
      if (i === 5) {
        document
          .getElementById("flooddiscard")
          .classList.add(floodHolding[i].className);
      }
    }
  }
  floodHolding.length = 0;
  youLose();
};

//unflood

const unflood = (e) => {
  var id = e.srcElement.id;
  var combinedLocations = [locations, floodDiscard];
  var eventLoc = document.getElementById(id);

  //if the location clicked is not NSEW of the player, reject the click.

  if (
    (eventLoc.offsetTop === pilot.y - offset + movement &&
      eventLoc.offsetLeft === pilot.x - offset) || //immediately south
    (eventLoc.offsetTop === pilot.y - offset - movement &&
      eventLoc.offsetLeft === pilot.x - offset) || //north
    (eventLoc.offsetLeft === pilot.x - offset - movement &&
      eventLoc.offsetTop === pilot.y - offset) || //west
    (eventLoc.offsetLeft === pilot.x - offset + movement &&
      eventLoc.offsetTop === pilot.y - offset) || // east
    (eventLoc.offsetTop === pilot.y - offset &&
      eventLoc.offsetLeft === pilot.x - offset)
  ) {
    //tile they're on
    document.getElementById(id).classList.remove("flooded");
    document.getElementById(id).style.opacity = "100%";
    document.getElementById(id).removeEventListener("click", unflood);
    playerActions++;

    //switch locations from flooded = true to flooded = false
    for (let i = 0; i < combinedLocations.length; i++) {
      for (let j = 0; j < combinedLocations[i].length; j++) {
        if (combinedLocations[i][j].id === id) {
          combinedLocations[i][j].flooded = false;
        }
      }
    }
  } else {
    return;
  }
};

//update Pilot X and Y to be on top of Fools Landing

const playerXAndY = () => {
  document.getElementById("pilot").style.left = foolsLanding.x + offset + "px";
  document.getElementById("pilot").style.top = foolsLanding.y + offset + "px";
  pilot.x = foolsLanding.x + offset;
  pilot.y = foolsLanding.y + offset;
};

//update x and y values for locations

const updateXAndY = () => {
  for (let i = 0; i < locations.length; i++) {
    locations[i].x = document.getElementById(locations[i].id).offsetLeft;
    locations[i].y = document.getElementById(locations[i].id).offsetTop;
  }
};

//randomly assign tiles

const randomTiles = () => {
  shuffleDeck(locations);
  let element = document.getElementsByClassName("tile");
  for (let i = 0; i < locations.length; i++) {
    if (element[i].id === "") {
      element[i].setAttribute("id", locations[i].id);
    }
  }
};

//update difficulty level
const difficultyLvl = (e) => {
  let eventSrc = e.srcElement.id;
  let lvlbtn = document.getElementsByClassName("lvlbtn");

  if (eventSrc === "novice") {
    progressBarValue = 5;
  } else if (eventSrc === "normal") {
    progressBarValue = 15;
  } else if (eventSrc === "elite") {
    progressBarValue = 25;
  } else if (eventSrc === "legendary") {
    progressBarValue = 35;
  }
  progressBar.value = progressBarValue;

  for (let i = 0; i < lvlbtn.length; i++) {
    lvlbtn[i].removeEventListener("click", difficultyLvl);
  }
};

const updateDifficultyBtns = () => {
  let lvlbtn = document.getElementsByClassName("lvlbtn");
  for (let i = 0; i < lvlbtn.length; i++) {
    lvlbtn[i].addEventListener("click", difficultyLvl);
  }
};

//Game Set up
const gameSetup = () => {
  //randomly generate board
  randomTiles();
  //update the x and y value of the locations;
  updateXAndY();
  //randomly flood 6 tiles
  flood();
  //shuffle treasure cards
  shuffleDeck(treasureDeck);
  //two treasure cards to the player
  treasureDeckDraw();
  //add btns to to waterlvl
  updateDifficultyBtns();
  //push watersrise into treasure deck
  for (let i = 0; i < 3; i++) {
    treasureDeck.push(watersRiseDeck[0]);
  }
  //shuffle treasuredeck(three times for good measure)
  for (let i = 0; i < 3; i++) {
    shuffleDeck(treasureDeck);
  }

  //update player x&Y so they start on their starting tile
  setTimeout(playerXAndY, 1000);
};

gameSetup();

//player turn

const playerTurn = () => {
  //if playerActions array.length === 3, button to end turn
  document
    .getElementById("drawtreasurecards")
    .addEventListener("click", playerDeckDraw);
  document.getElementById("playeractions").style.visibility = "visible";
  document.getElementById("playeractions").innerText =
    "Player Actions: " + playerActions;
  if (playerActions === 3) {
    document.getElementById("playeractions").innerText =
      "Player Actions: " +
      playerActions +
      " (You've hit your limit! Draw two treasure cards!)";
    clickBlock();
  }
};

setInterval(playerTurn, 100);

const playerDeckDraw = () => {
  treasureDeckDraw();
  document.getElementById("endturn").style.display = "flex";
  document.getElementById("endturn").addEventListener("click", endTurn);
  document.getElementById("drawtreasurecards").style.display = "none";
};

const endTurn = () => {
  islandTurn = true;
  flood();
  removeBlock();
  playerActions = 0;
  document.getElementById("endturn").style.display = "none";
  document.getElementById("drawtreasurecards").style.display = "flex";
};

//collect treasures

const collectTreasure = (e) => {
  let triggerBtn = e.srcElement.id + "treasure";
  let length = pilot.hand.length;
  let trigger = e.srcElement.id;
  treasureCount++;
  playerActions++;
  for (let i = 0; i < treasurePickupLocations.length; i++) {
    if (triggerBtn === treasurePickupLocations[i].treasure) {
      document.getElementById(
        treasurePickupLocations[i].treasure
      ).style.visibility = "visible";
      document.getElementById(treasurePickupLocations[i].treasure).style.width =
        "100px";
      document.getElementById(
        treasurePickupLocations[i].treasure
      ).style.height = "100px";
      if (
        document.getElementById("earthtreasure").style.visibility === "visible"
      ) {
        earthTreasureCollected = true;
      } else if (
        document.getElementById("firetreasure").style.visibility === "visible"
      ) {
        fireTreasureCollected = true;
      } else if (
        document.getElementById("watertreasure").style.visibility === "visible"
      ) {
        waterTreasureCollected = true;
      } else if (
        document.getElementById("airtreasure").style.visibility === "visible"
      ) {
        airTreasureCollected = true;
      }
    }
  }

  let children = document.getElementById("treasurehand").children;
  let childLength = children.length;
  //remove cards with classname
  let indices = [];

  for (let i = 0; i < length; i++) {
    if (pilot.hand[i].id === trigger) {
      treasuresDiscard.push(pilot.hand[i]); //working
      indices.unshift(i); //working
    }
  }

  let indicesLength = indices.length;

  for (let k = 0; k < indicesLength; k++) {
    pilot.hand.splice(indices[k], 1);
  }

  let domIndices = [];

  for (let j = 0; j < childLength; j++) {
    if (children[j].classList.contains(trigger)) {
      domIndices.unshift(j);
    }
  }

  let domIndicesLength = domIndices.length;

  for (let i = 0; i < domIndicesLength; i++) {
    children[domIndices[i]].remove();
  }

  //remove previous classname from div
  treasureDiscardDOM.classList = "";
  //add new class name
  treasureDiscardDOM.classList.add(trigger);
  document
    .getElementById(trigger)
    .parentNode.removeChild(document.getElementById(trigger));

  checkTreasures = setInterval(collectTreasuresBtn, 100);
};

//collect treasures btn
const stopCheckTreasures = () => clearInterval(checkTreasures);

const collectTreasuresBtn = () => {
  let hand = pilot.hand;
  let earth = 0;
  let fire = 0;
  let air = 0;
  let water = 0;

  //if player has 4 of the same treasure in hand AND is on specific location
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].id === "earth") {
      earth++;
    } else if (hand[i].id === "fire") {
      fire++;
    } else if (hand[i].id === "water") {
      water++;
    } else if (hand[i].id === "air") {
      air++;
    }
  }
  //create btn

  let newBtn = document.createElement("button");

  //collect *treasure name* treasure
  if (
    (earth >= 4 &&
      pilot.x - offset === templeOfTheMoon.x &&
      pilot.y - offset === templeOfTheMoon.y &&
      earthTreasureCollected === false &&
      playerActions < 3) ||
    (earth >= 4 &&
      pilot.x - offset === templeOfTheSun.x &&
      pilot.y - offset === templeOfTheSun.y &&
      earthTreasureCollected === false &&
      playerActions < 3)
  ) {
    newBtn.setAttribute("id", "earth");
    newBtn.innerText = "Collect Treasure";
    newBtn.addEventListener("click", collectTreasure);
    document.getElementById("treasures").appendChild(newBtn);
    clearInterval(checkTreasures);
    return;
  } else if (
    (fire >= 4 &&
      pilot.x - offset === caveOfEmbers.x &&
      pilot.y - offset === caveOfEmbers.y &&
      fireTreasureCollected === false &&
      playerActions < 3) ||
    (fire >= 4 &&
      pilot.x - offset === caveOfShadows.x &&
      pilot.y - offset === caveOfShadows.y &&
      fireTreasureCollected === false &&
      playerActions < 3)
  ) {
    newBtn.setAttribute("id", "fire");
    newBtn.addEventListener("click", collectTreasure);
    newBtn.innerText = "Collect Treasure";
    document.getElementById("treasures").appendChild(newBtn);
    clearInterval(checkTreasures);
    return;
  } else if (
    (air >= 4 &&
      pilot.x - offset === whisperingGarden.x &&
      pilot.y - offset === whisperingGarden.y &&
      airTreasureCollected === false &&
      playerActions < 3) ||
    (air >= 4 &&
      pilot.x - offset === howlingGarden.x &&
      pilot.y - offset === howlingGarden.y &&
      airTreasureCollected === false &&
      playerActions < 3)
  ) {
    newBtn.setAttribute("id", "air");
    newBtn.addEventListener("click", collectTreasure);
    newBtn.innerText = "Collect Treasure";
    document.getElementById("treasures").appendChild(newBtn);
    clearInterval(checkTreasures);
    return;
  } else if (
    (water >= 4 &&
      pilot.x - offset === tidalPalace.x &&
      pilot.y - offset === tidalPalace.y &&
      waterTreasureCollected === false &&
      playerActions < 3) ||
    (water >= 4 &&
      pilot.x - offset === coralPalace.x &&
      pilot.y - offset === coralPalace.y &&
      fireTreasureCollected === false &&
      playerActions < 3)
  ) {
    newBtn.setAttribute("id", "water");
    newBtn.addEventListener("click", collectTreasure);
    newBtn.innerText = "Collect Treasure";
    document.getElementById("treasures").appendChild(newBtn);
    clearInterval(checkTreasures);
    return;
  }
  //treasure picture visible
};

let checkTreasures = setInterval(collectTreasuresBtn, 100);
