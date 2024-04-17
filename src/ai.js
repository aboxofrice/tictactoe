class AI {
    constructor(symbol) {
        this.symbol = symbol;
    }

    /**
     * A function that simulates the AI making a move on the board after "thinking" for 500 ms.
     *
     * @param {Array} board - the current state of the game board
     * @return {Promise} a promise that resolves with the position where the AI will make its move
     */
    makeMove(board) {
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

module.exports = AI;
