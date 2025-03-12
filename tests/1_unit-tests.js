const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.strictEqual(
            solver.validate('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
            true
        )
     });

     test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.deepEqual(
            solver.validate('..839.7.575.....964..1.a..@..16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
            { error: 'Invalid characters in puzzle' }
        )
     })

     test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.deepEqual(
            solver.validate('..839.7.575.....964..1.......6.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
            { error: 'Expected puzzle to be 81 characters long' }
        )
     })

     test('Logic handles a valid row placement', () => {
        assert.strictEqual(
            solver.checkRowPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                2
            ),
            true
        )
     })

     test('Logic handles an invalid row placement', () => {
        assert.strictEqual(
            solver.checkRowPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                8
            ),
            false
        )
     })

     test('Logic handles a valid column placement', () => {
        assert.strictEqual(
            solver.checkColPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                1
            ),
            true
        )
     })

     test('Logic handles an invalid column placement', () => {
        assert.strictEqual(
            solver.checkColPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                7
            ),
            false
        )
     })

     test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.strictEqual(
            solver.checkRegionPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                9
            ),
            true
        )
     })

     test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.strictEqual(
            solver.checkRegionPlacement(
                '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                0,
                0,
                8
            ),
            false
        )
     })

     test('Valid puzzle strings pass the solver', () => {
        assert.strictEqual(
            solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
            '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
        )
     })

     test('Invalid puzzle strings fail the solver', () => {
        assert.strictEqual(
            solver.solve('..839.7.575.7777964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
            false
        )
     })

     test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.strictEqual(
            solver.solve('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'),
            '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
        )
     })
});
