import chai from 'chai'
import mocha from 'mocha'
import {hello} from '../src'

// const before = mocha.after
// const beforeEach = mocha.beforeEach
// const after = mocha.after
// const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

describe('node-js-starter', function () {
    // before(() => {
    // })
    // beforeEach(() => {
    // })
    // after(() => {
    // })
    // afterEach(() => {
    // })

    describe('hello', function () {
        it('run', (done) => {
            // inputs
            const input = 'World'

            // expected outputs
            const expected = 'Hello World'

            // executes
            const output = hello(input)

            // asserts
            expect(output).to.equal(expected)

            done()
        })
    })
})
