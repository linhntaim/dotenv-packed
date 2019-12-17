import {install, env, getenv} from '../src/main'
import mocha from 'mocha'
import chai from 'chai'

const describe = mocha.describe
const it = mocha.it
chai.should()

describe('dotenv-packed', function () {
    describe('unit tests', function () {
        it('install', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }

            Object.assign(process.env, input)
            install()

            env().should.deep.include(expected)
            getenv().should.deep.include(expected)
            getenv('VARIABLE_1').should.deep.equal(expected.VARIABLE_1)
            getenv('VARIABLE_2').should.deep.equal(expected.VARIABLE_2)

            done()
        })

        it('install 2', function (done) {
            const input = {
                VARIABLE_3: 'variable 3',
                VARIABLE_4: 'variable 4',
            }
            const expected = {
                VARIABLE_3: 'VARIABLE 3',
                VARIABLE_4: 'variable 4',
            }

            Object.assign(process.env, input)
            install({
                dotenvConversionConfig: {
                    specs: {
                        VARIABLE_3(value) {
                            return value.toUpperCase()
                        },
                    },
                },
            })

            env().should.deep.include(expected)
            getenv().should.deep.include(expected)
            getenv('VARIABLE_3').should.deep.equal(expected.VARIABLE_3)
            getenv('VARIABLE_4').should.deep.equal(expected.VARIABLE_4)

            done()
        })
    })
})
