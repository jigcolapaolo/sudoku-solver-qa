class SudokuSolver {


  getPuzzleArray(puzzleString) {
    let puzzleArray = []
    let row = 0

    for(let i = 0; i < puzzleString.length; i++) {

      if (!puzzleArray[row]) {
        puzzleArray.push([puzzleString[i]])
      } else if (puzzleArray[row].length === 9) {
        row++
        puzzleArray.push([puzzleString[i]])
      } else {
        puzzleArray[row].push(puzzleString[i])
      }
    }

    return puzzleArray
  }

  getEmptyCells(puzzleArray) {
    let emptyCells = []

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzleArray[row][col] === ".") emptyCells.push([row, col])
      }
    }

    return emptyCells
  }

  validate(puzzleString) {
    const puzzleRegex = /^[1-9.]{81}$/

    if (puzzleString.length !== 81)  
      return { error: 'Expected puzzle to be 81 characters long' };
    if (!puzzleRegex.test(puzzleString))
      return { error: 'Invalid characters in puzzle' }

    
    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzleArray = this.getPuzzleArray(puzzleString)
    return !puzzleArray[row].includes(value.toString())
  }

  checkColPlacement(puzzleString, row, column, value) {
    let puzzleArray = this.getPuzzleArray(puzzleString)
    let i = 0

    while(i < puzzleArray.length) {

      if(puzzleArray[i][column] === value.toString())
        return false

      i++
    }

    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let puzzleArray = this.getPuzzleArray(puzzleString)

    let boxRowStart = Math.floor(row / 3) * 3
    let boxColStart = Math.floor(column / 3) * 3;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleArray[boxRowStart + i][boxColStart + j] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {

    let puzzleArray = this.getPuzzleArray(puzzleString)
    let emptyCells = this.getEmptyCells(puzzleArray)

    if (this.solveSudoku(puzzleArray, emptyCells, 0)) {
      return puzzleArray.flat().join("");
    } else {
      return false;
    }
  }

  solveSudoku(puzzleArray, emptyCells, index) {
    if (index >= emptyCells.length) return true;
  
    let [row, col] = emptyCells[index];

    let puzzleString = puzzleArray.flat().join("")
  
    for (let num = 1; num <= 9; num++) {
      if (
        this.checkRowPlacement(puzzleString, row, col, num) &&
        this.checkColPlacement(puzzleString, row, col, num) &&
        this.checkRegionPlacement(puzzleString, row, col, num)
      ) {
        puzzleArray[row][col] = num.toString();
  
        if (this.solveSudoku(puzzleArray, emptyCells, index + 1)) {
          return true;
        }
  
        puzzleArray[row][col] = ".";
      }
    }
  
    return false;
  }
}

module.exports = SudokuSolver;

