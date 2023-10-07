import chai from 'chai'
import dotenvPacked from '../src'
import mocha from 'mocha'

const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

describe('dotenv-packed', function () {
    describe('standalone', function () {
        function useEnv(env) {
            return {
                parsed: env,
            }
        }

        it('basic', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const inputEnv = {
                VARIABLE_3: 'variable 3',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expectedForEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_3: 'variable 3',
            }

            Object.assign(process.env, inputEnv)
            const {parsed, get} = dotenvPacked.pack(useEnv(input))

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedForEnv)
            get('VARIABLE_1').should.equal(expected.VARIABLE_1)
            get('VARIABLE_2').should.equal(expected.VARIABLE_2)
            get('VARIABLE_3').should.equal(expectedForEnv.VARIABLE_3)

            expect(process.env.VARIABLE_4).to.be.an('undefined')
            expect(get('VARIABLE_4')).to.be.a('null')
            get('VARIABLE_4', 'variable 4').should.equal('variable 4')

            done()
        })
    })
})
