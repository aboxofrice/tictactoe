const readline = require('readline');
const Player = require('./player');
const AI = require('./ai');

/**
 * Check if the values at the given indices in the board array are the same and not empty.
 *
 * @param {Array} board - the board array
 * @param {number} index1 - the index of the first value to check
 * @param {number} index2 - the index of the second value to check
 * @param {number} index3 - the index of the third value to check
 * @return {boolean} true if the values at the given indices are the same and not empty, otherwise false
 */
function checkLine(board, index1, index2, index3) {
    return (board[index1] === board[index2] && board[index2] === board[index3] && board[index1] !== ' ');
}

/**
 * Function to check the board for a winning combination.
 *
 * @param {array} board - The game board to check.
 * @return {boolean} Indicates if there is a winner or not.
 */
function checkBoard(board) {
    // Check rows
    if (checkLine(board, 0, 1, 2) ||
        checkLine(board, 3, 4, 5) ||
        checkLine(board, 6, 7, 8)) {
        return true; // There is a winner
    }

    // Check columns
    if (checkLine(board, 0, 3, 6) ||
        checkLine(board, 1, 4, 7) ||
        checkLine(board, 2, 5, 8)) {
        return true; // There is a winner
    }

    // Check diagonals
    if (checkLine(board, 0, 4, 8) ||
        checkLine(board, 2, 4, 6)) {
        return true; // There is a winner
    }

    return false; // No winner found
}

class Game {
    /**
     * Constructor function to initialize the game board, players, and readline interface.
     */
    constructor() {
        this.board = Array(9).fill(' ');
        this.currentPlayer = null;
        this.player1 = null;
        this.player2 = null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Listen for SIGINT (Ctrl+C) signal
        process.on('SIGINT', () => {
            this.rl.close();
            process.exit(0);
        });
    }

    /**
     * Method to start the game by setting up players and starting the gameplay.
     *
     * @return {Promise<void>} - A promise that resolves when the game starts.
     */
    async start() {
        const numPlayers = await this.promptNumberOfPlayers();
        if (numPlayers === 0) {
            this.player1 = new AI('X');
            this.player2 = new AI('O');
        } else if (numPlayers === 1) {
            this.player1 = new Player('X');
            this.player2 = new AI('O');
        } else {
            this.player1 = new Player('X');
            this.player2 = new Player('O');
        }
        this.currentPlayer = this.player1;
        this.play();
    }

    /**
     * A function that prompts the user for the number of players.
     *
     * @return {Promise} resolves with the number of players entered
     */
    promptNumberOfPlayers() {
        return new Promise((resolve) => {
            this.rl.question('Enter number of players (0 for computer vs computer, 1 for human vs computer): ', (answer) => {
                resolve(parseInt(answer));
            });
        });
    }

    /**
     * Asynchronously plays the Tic Tac Toe game, alternating between players until the game is over,
     * then prints the game board and the result before exiting the process.
     *
     * @return {void} 
     */
    async play() {
        console.log('Starting Tic Tac Toe game...\n');
        while (!this.isGameOver()) {
            this.printBoard();
            const move = await this.currentPlayer.makeMove(this.board, this.rl);
            this.board[move] = this.currentPlayer.symbol;
            this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        }
        this.printBoard();
        const result = this.getResults();
        console.log(result);
        process.exit(0);
    }

    /**
     * Prints the current state of the board to the console.
     */
    printBoard() {
        console.clear();
        console.log('-------------');
        for (let i = 0; i < 3; i++) {
            let row = '|';
            for (let j = 0; j < 3; j++) {
                row += ` ${this.board[i * 3 + j]} |`;
            }

            console.log(row);
            console.log('-------------');
        }
    }

    /**
     * Check if the game is over by looking for a winner or a draw on the board.
     *
     * @return {boolean} Returns true if the game is over, false otherwise.
     */
    isGameOver() {

        if (checkBoard(this.board)) {
            return true; // There is a winner winner chicken dinner
        }

        // Check for a draw
        if (!this.board.includes(' ')) {
            return true; // The board is full and there is no winner
        }

        // If neither a winner nor a draw, the game is not over yet
        return false;
    }

    getResults() {
        if (this.isGameOver()) {
            // Check for a winner
            if (checkBoard(this.board)) {
                // Determine the winning player
                const winningPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
                return `Player ${winningPlayer.symbol} wins!`;
            }

            // Check for a draw
            if (!this.board.includes(' ')) {
                return 'It\'s a draw!'; // The board is full and there is no winner
            }
        }

        // If the game is still in progress or the outcome is not determined yet
        return 'Game is still in progress...';
    }

}

module.exports = Game;
