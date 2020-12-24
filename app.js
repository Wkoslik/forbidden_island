/* notes

1. Generate game board
2. water level array
3. card constructor
    3.a one of the key values can be which deck they belong to
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