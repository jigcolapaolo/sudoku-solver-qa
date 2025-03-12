'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) 
      return res.json({ error: 'Required field(s) missing' });

    const response = solver.validate(puzzle);
    if (response != true) 
      return res.json(response);

    if (coordinate.length !== 2) 
      return res.json({ error: 'Invalid coordinate' });

    const [row, column] = coordinate.toUpperCase().split("");
    if (!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column)) 
      return res.json({ error: 'Invalid coordinate' });

    if (!/^[1-9]$/.test(value)) 
      return res.json({ error: 'Invalid value' });

    const rowIndex = row.charCodeAt(0) - 65; // 0-8
    const colIndex = parseInt(column, 10) - 1; // 0-8

    let puzzleArray = solver.getPuzzleArray(puzzle);

    if (puzzleArray[rowIndex][colIndex] === value.toString()) {
      return res.json({ valid: true });
    }

    let conflict = []

    if (!solver.checkRowPlacement(puzzle, rowIndex, colIndex, value)) conflict.push("row")
    if (!solver.checkColPlacement(puzzle, rowIndex, colIndex, value)) conflict.push("column")
    if (!solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value)) conflict.push("region")

    if (conflict.length === 0)
      return res.json({ valid: true })
    else
      return res.json({ valid: false, conflict }) 
  });

    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body
      if (!puzzle) return res.json({ error: 'Required field missing' })

      const response = solver.validate(puzzle)
      if (response != true) return res.json(response)

      const solution = solver.solve(puzzle)

      return !solution ? res.json({ error: 'Puzzle cannot be solved' }) : res.json({ solution }) 
  });
};
