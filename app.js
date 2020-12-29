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
let locations = ['Howling Garden', 'Lost Lagoon', 'Cave of Shadows', 'Phantom Rock', 
                'Silver Gate', 'Temple of the Sun', 'Watchtower', 'Iron Gate', 
                'Fools Landing', 'Copper Gate', 'Coral Palace', 'Dunes of Deception', 
                'Gold Gate', 'Bronze Gate', 'Crimson Forest', 'Observatory', 
                'Tidal Palace', 'Whispering Garden', 'Temple of the Moon', 'Misty Marsh',
                'Twilight Hollow', 'Cave of Embers', 'Cliffs of Abandon', 'Breakers Bridge'];
let treasures = ['Waters Rise!', 'Waters Rise!', 'Waters Rise!',
                'Sandbags', 'Sandbags',
                'Helicopter Lift', 'Helicopter Lift', 'Helicopter Lift', 
                'Earth', 'Earth', 'Earth', 'Earth', 'Earth',
                'Water', 'Water', 'Water', 'Water', 'Water',
                'Fire', 'Fire', 'Fire', 'Fire', 'Fire', 
                'Air', 'Air', 'Air', 'Air', 'Air'];
let locationsDiscard = [];
let treasuresDiscard = [];
let pilot = document.getElementById("pilot");

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


//movement with board game boundaries

