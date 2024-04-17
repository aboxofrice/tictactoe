class Player {
    constructor(symbol) {
        this.symbol = symbol;
    }

    makeMove(board, rl) {
        return new Promise((resolve, reject) => {
            const promptUser = () => {
                rl.question(`Player ${this.symbol}, enter your move (1-9): `, (input) => {
                    const position = parseInt(input) - 1;
                    if (isNaN(position) || position < 0 || position >= 9 || board[position] !== ' ') {
                        console.log('Invalid move. Please enter a number between 1 and 9 corresponding to an empty cell.');
                        promptUser(); // Ask again for input
                    } else {
                        resolve(position);
                    }
                });
            };

            promptUser(); // Start prompting for input
        });
    }
    makeRandomMove(board) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let position;
                do {
                    position = Math.floor(Math.random() * 9);
                } while (board[position] !== ' ');

                resolve(position);
            }, 500); // Simulating AI "thinking" time
        });
    }




}

module.exports = Player;
