const prompt = require('prompt-sync')({sigint: true});

// constant game elements
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';


// constant game scenarios
const WIN = "You found the hat! You won!";                                           // win
const LOSE = "Game over! Try again!";                                                // lose
const OUT_BOUND = "You have fallen out of the field! Ouch!";                         // out of bounds
const INTO_HOLE = "You have fallen into a hole! Ouch!";                              // fallen into hole
const WELCOME = "Welcome to Find Your Hat!";                                         // welcome message
const DIRECTION = "Which direction: north(n), south(s), east(e), west(w)?"           // directions for movement
const QUIT = "Press q or Q to quit the game."                                        // directions for quit
const END_GAME = "Game ended. Thank you!"                                            // game ended
const NOT_RECOGNISED = "Input not recognised. Please press either n, s, e, w, or q." // input not recognised

class Field {
    // constructor
    constructor(rows, cols) {
        this.rows = rows;                                                        // property to setup no. of rows for the game
        this.cols = cols;                                                        // property to setup no. of cols for the game
        this.field = new Array ([]);                                             // property that represents the field for game
        this.gamePlay = false;                                                   // property to setup the gameplay
        this.randomX = 0                                                         // random number for X axis (holes and hats placement)
        this.randomY = 0                                                         // random number for Y axis (holes and hats placement)
        this.playerX = 0                                                         // player position X axis
        this.playerY = 0                                                         // player position Y axis
    };

    /* 
    * METHODS
    */
    static welcomeMsg(msg) {
        console.log(
            "\n*******************************************************\n"
            + msg +
            "\n*******************************************************\n"
        );
    };

    // generate the game field
    generateField() {

        for (let i = 0; i < this.rows; i++) {
            this.field[i] = new Array();                                         // generate field rows

            for (let j = 0; j < this.cols; j++) {
                this.field[i][j] = GRASS;                                        // generate field columns

            }; 
        };

        // place the player on the board ([0][0])
        this.field[this.playerX][this.playerY] = PLAYER;

        // generate holes on the board using random number generator
        let holeNumber = Math.ceil((this.rows * this.cols) * 0.2);

        while (holeNumber > 0) {
            this.randomY = Math.floor(Math.random() * this.rows);
            this.randomX = Math.floor(Math.random() * this.cols);

            if(this.field[this.randomY][this.randomX] !== HOLE && this.field[this.randomY][this.randomX] !== PLAYER) {
                this.field[this.randomY][this.randomX] = HOLE;
                holeNumber -= 1;
            } 
        };

        // place hat on the board using random number generator
        let hatNumber = 1
        do {
            this.randomY = Math.floor(Math.random() * this.rows);
            this.randomX = Math.floor(Math.random() * this.cols);
            
            if (this.field[this.randomY][this.randomX] !== HOLE && this.field[this.randomY][this.randomX] !== PLAYER){
                this.field[this.randomY][this.randomX] = HAT;
                hatNumber -= 1;
            };
            
        } while (hatNumber === 1);
    };

    // print out the game field
    printField() {
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    };

    // start game
    startGame() {
        this.gamePlay = true;
        this.generateField(this.rows, this.cols);
        this.printField()
        this.updateGame();
    };

    // update game
    updateGame() {

        // obtain user input
        let userInput = "";

        // get the user's direction
        do {
            console.log(DIRECTION.concat(" ", QUIT));
            userInput = prompt();

            //switch statement for user input, update position of player
            switch (userInput.toLowerCase()) {
                case "n":
                case "s":
                case "e":
                case "w":
                    // update player location on board
                    this.updatePlayer(userInput.toLowerCase());
                    this.field[this.playerY][this.playerX] = PLAYER;                                                           
                    break;
                case "q":
                    this.endGame();                                                                 // user has quit the game    
                    break;
                default:
                    console.log(NOT_RECOGNISED);                                                    // input not recognised
                    break;
            }

            // generate field
            this.printField()
            
        } while(userInput.toLowerCase() !== "q");
    };

    // end game
    endGame() {
        console.log(END_GAME);
        this.gamePlay = false;
        process.exit();
    };

    // update the player and game condition
    updatePlayer(position) {
        console.log("Player has moved: " + position);

        // update the player's position in the field
        switch (position) {
            case "n":
                this.playerY --;
                break;
            case "s":
                this.playerY ++;
                break;
            case "e":
                this.playerX ++; 
                break;
            case "w":
                this.playerX --;
                break;
        
            default:
                break;
        };
        
        // check if player has gotten out of bounds - if yes, endGame()
        if (this.playerY < 0 || this.playerY > this.rows - 1 || this.playerX < 0 || this.playerX > this.cols - 1) {
            console.log(OUT_BOUND + " " + LOSE);
            this.endGame();
        };

        // check if player has fallen into hole, if yes, endgame()
        if (this.field[this.playerY][this.playerX] === HOLE) {
            console.log(INTO_HOLE + " " + LOSE);
            this.endGame();
        };

        // check if player has found the hat - if yes, endGame()
        if (this.field[this.playerY][this.playerX] === HAT) {
            console.log(WIN);
            this.endGame();
        };
    };

};

// static method to welcome player
Field.welcomeMsg(WELCOME);

// generate new field
const ROWS = 10
const COLS = 10
const field = new Field(ROWS, COLS);

field.startGame();

