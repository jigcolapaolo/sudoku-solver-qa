const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, { solution: '827549163531672894649831527496157382218396475753284916962415738185763249374928651' })
                done()
            })
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: null
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field missing' })
                done()
            })
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: '82..4..6.@.16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
                done()
            })
    })

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: '82....6.@.16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
                done()
            })
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: '82..4..6...16..89...98315.749.157....777......53..4...96.415..81..7632..3...28.51'
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
                done()
            })
    })

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 1
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, { valid: true })
                done()
            })
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 3
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, "valid")
                assert.property(res.body, "conflict")
                assert.strictEqual(res.body.conflict.length, 1)
                done()
            })
    })

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 8
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, "valid")
                assert.property(res.body, "conflict")
                assert.isAbove(res.body.conflict.length, 1)
                done()
            })
    })

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 7
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, "valid")
                assert.property(res.body, "conflict")
                assert.strictEqual(res.body.conflict.length, 3)
                done()
            })
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: null,
                coordinate: null,
                value: null
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Required field(s) missing' })
                done()
            })
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.57@.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 7 
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
                done()
            })
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.57.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 7 
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
                done()
            })
    })

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'J1',
                value: 7
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid coordinate' })
                done()
            })
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
                coordinate: 'A1',
                value: 23
            })
            .end((err, res) => {
                assert.deepEqual(res.body, { error: 'Invalid value' })
                done()
            })
    })

});

