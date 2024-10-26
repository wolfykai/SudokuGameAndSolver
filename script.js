/* 
* &copy; 2024 Kai Wolf. All rights reserved.
*/


/*##################### Main Functions #####################*/

document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("sudoku-board");
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.classList.add("cell");
        cell.setAttribute("type", "number"); 
        cell.setAttribute("maxlength", "1"); 
        cell.setAttribute("min", "1");
        cell.setAttribute("max", "9"); 
        board.appendChild(cell);
    }
});

document.getElementById("check-solution").addEventListener("click", () => {
    const board = getSudokuBoard();
    if(!checkBoardNotEmpty(board)) {
        alert("The board is empty!");
        return;
    }

    alert("Checking your solution!");
    let [status, row, col] = checkSolution(board);

    document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.remove("error");
    });

    if(status){
        alert("Your solution is correct!");
    } else {
        alert("Your solution is incorrect! Error at row " + (row + 1) + " and column " + (col + 1) + "!");
        const index = row * 9 + col;
        document.querySelectorAll(".cell")[index].classList.add("error");
    }
});

document.getElementById("solve-board").addEventListener("click", () => {
    const board = getSudokuBoard();
    if(!checkBoardNotEmpty(board)) {
        alert("The board is empty!");
        return;
    }

    alert("Solver is running!");
    let solved = solveSudoku(board);
    fillCells(board);
    if(solved){
        alert("Sudoku solved!");
    } else {
        alert("No solution exists!");
    }
});

document.getElementById("new-game").addEventListener("click", () => {
    difficulty = document.getElementById("difficulty").value;
    alert("Starting a new game with difficulty: " + difficulty + "!");
    const board = createRandomSudokuBoard();
    const cells = document.querySelectorAll(".cell");
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col;
            cells[index].value = board[row][col] === 0 ? "" : board[row][col];
            cells[index].readOnly = board[row][col] !== 0;
        }
    }
});



/*##################### Board Functions #####################*/

/*
The function getSudokuBoard gets the current state of the Sudoku board from the website.
    Output: the current state of the Sudoku board
*/
function getSudokuBoard() {
    const board = []; 
    const cells = document.querySelectorAll(".cell"); 

    for (let row = 0; row < 9; row++) {
        const rowArray = []; 
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col; 
            const cellValue = cells[index].value; 
            rowArray.push(cellValue ? Number(cellValue) : 0); 
        }
        board.push(rowArray); 
    }

    return board; 
}

/*
The function createEmptySudokuBoard creates an empty Sudoku board.
    Output: an empty Sudoku board
*/
function createEmptySudokuBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

/*
The function createRandomSudokuBoard creates a random Sudoku board with a given difficulty level.
    Output: a random Sudoku board
*/
function createRandomSudokuBoard() {
    const board = createEmptySudokuBoard();
    difficulty = document.getElementById("difficulty").value;
    switch(difficulty) {
        case "easy":
            cellsToFill = 30;
            break;
        case "medium":
            cellsToFill = 20;
            break;
        case "hard":
            cellsToFill = 10;
            break;
    }
    while(cellsToFill > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const value = Math.floor(Math.random() * 9) + 1;
        if(isSafe(board, row, col, value)) {
            board[row][col] = value;
            cellsToFill--;
        }
    }
    return board;
}

/*
The function fillCells fills the cells of the website board with the values of the input board.
    Input: board
*/
function fillCells(board){
    const cells = document.querySelectorAll(".cell");
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            const index = row * 9 + col;
            cells[index].value = board[row][col] === 0 ? "" : board[row][col];
        }
    }
}



/*##################### Helper Functions #####################*/

/*
The function solveSudoku solves the Sudoku puzzle with a backtracking algorithm.
    Input: board
    Output: true if the puzzle is solved, false otherwise
*/
function solveSudoku(board){
    let [row, col] = nextZero(board);
    if(row == -1){
        return true;
    }
    for(let num = 1; num <= 9; num++){
        if(isSafe(board, row, col, num)){
            board[row][col] = num;
            if(solveSudoku(board)){
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

/*
The function nextZero finds the next empty cell in the board.
    Input: board
    Output: the row and column of the next empty cell
*/
function nextZero(board){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(board[i][j] == 0){
                return [i, j];
            }
        }
    }
    return [-1, -1];
}



/*##################### Checking Functions #####################*/

/*
The function isSafe checks if a value is safe to be placed in a cell.
    Input: board, row, col, value
    Output: true if the value is safe to be placed in the cell, false otherwise
*/
function isSafe(board, row, col, value) {
    return checkRow(board, row, value) && checkCol(board, col, value) && checkSquare(board, row, col, value); 
}

/*
The function checkRow checks if a value is safe to be placed in a row.
    Input: board, row, value
    Output: true if the value is safe to be placed in the row, false otherwise
*/
function checkRow(board, row, value) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === value) {
            return false; 
        }
    }
    return true; 
}

/*
The function checkCol checks if a value is safe to be placed in a column. 
    Input: board, col, value
    Output: true if the value is safe to be placed in the column, false otherwise 
*/
function checkCol(board, col, value) {
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === value) {
            return false; 
        }
    }
    return true; 
}

/*
The function checkSquare checks if a value is safe to be placed in a 3x3 square. 
    Input: board, row, col, value
    Output: true if the value is safe to be placed in the square, false otherwise 
*/
function checkSquare(board, row, col, value) {
    const startRow = row - row % 3; 
    const startCol = col - col % 3; 

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === value) {
                return false; 
            }
        }
    }
    return true; 
}

/*
The function checkSolution checks if the Sudoku board is a valid solution.
    Input: board
    Output: true if the board is a valid solution, false otherwise
*/
function checkSolution(board){
    let [status, row, col] = checkEachRow(board);
    if(!status){
        return [status, row, col];
    }
    [status, row, col] = checkEachCol(board);
    if(!status){
        return [status, row, col];
    }
    [status, row, col] = checkEachSquare(board);
    if(!status){
        return [status, row, col];
    }
    return [true, -1, -1];
}

/*
The function checkEachRow checks if each row in the board is valid.
    Input: board
    Output: true if each row is valid, false otherwise
*/
function checkEachRow(board){
    for(let row = 0; row < 9; row++){
        let rowSet = new Set();
        for(let col = 0; col < 9; col++){
            if(board[row][col] == 0){
                return [false, row, col];
            }
            if(rowSet.has(board[row][col])){
                return [false, row, col];
            }
            rowSet.add(board[row][col]);
        }
    }
    return [true, -1, -1];
}

/*
The function checkEachCol checks if each column in the board is valid.
    Input: board
    Output: true if each column is valid, false otherwise
*/
function checkEachCol(board){
    for(let col = 0; col < 9; col++){
        let colSet = new Set();
        for(let row = 0; row < 9; row++){
            if(board[row][col] == 0){
                return [false, row, col];
            }
            if(colSet.has(board[row][col])){
                return [false, row, col];
            }
            colSet.add(board[row][col]);
        }
    }
    return [true, -1, -1];
}

/*
The function checkEachSquare checks if each 3x3 square in the board is valid.
    Input: board
    Output: true if each square is valid, false otherwise
*/
function checkEachSquare(board){
    for(let row = 0; row < 9; row += 3){
        for(let col = 0; col < 9; col += 3){
            let squareSet = new Set();
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(board[row + i][col + j] == 0){
                        return [false, row + i, col + j];
                    }
                    if(squareSet.has(board[row + i][col + j])){
                        return [false, row + i, col + j];
                    }
                    squareSet.add(board[row + i][col + j]);
                }
            }
        }
    }
    return [true, -1, -1];
}

/*
The function checkBoardNotEmpty checks if the board is not empty.
    Input: board
    Output: true if the board is not empty, false otherwise
*/
function checkBoardNotEmpty(board){
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(board[row][col] != 0){
                return true;
            }
        }
    }
    return false;
}