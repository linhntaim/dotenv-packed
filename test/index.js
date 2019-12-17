import {parseEnv, getEnv} from '../src'
import mocha from 'mocha'
import chai from 'chai'

const describe = mocha.describe
const it = mocha.it
chai.should()

describe('dotenv-packed', function () {
    describe('unit tests', function () {
        it('parse env', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }

            Object.assign(process.env, input)
            parseEnv()

            getEnv().should.deep.include(expected)
            getEnv('VARIABLE_1').should.deep.equal(expected.VARIABLE_1)
            getEnv('VARIABLE_2').should.deep.equal(expected.VARIABLE_2)

            done()
        })

        it('parse env 2', function (done) {
            const input = {
                VARIABLE_3: 'variable 3',
                VARIABLE_4: 'variable 4',
            }
            const expected = {
                VARIABLE_3: 'VARIABLE 3',
                VARIABLE_4: 'variable 4',
            }

            Object.assign(process.env, input)
            parseEnv({
                dotenvConfigOptions: {},
                dotenvConversionConfigOptions: {
                    specs: {
                        VARIABLE_3(value) {
                            return value.toUpperCase()
                        },
                    },
                },
            })

            getEnv().should.deep.include(expected)
            getEnv('VARIABLE_3').should.deep.equal(expected.VARIABLE_3)
            getEnv('VARIABLE_4').should.deep.equal(expected.VARIABLE_4)

            done()
        })
    })
})
