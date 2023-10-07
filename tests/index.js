import chai from 'chai'
import dotenvPacked from '../src'
import fs from 'fs'
import mocha from 'mocha'

const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

const originEnv = {...process.env}
afterEach(() => {
    process.env = {...originEnv}
})

describe('dotenv-packed', function () {
    describe('pack:standalone', function () {
        function useEnv(env) {
            return {
                parsed: env,
            }
        }

        it('parsed', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed, get} = dotenvPacked.pack(
                Object.assign(
                    {},
                    useEnv(input),
                    {
                        ignoreProcessEnv: true,
                        dotenvExpandConfig: {},
                        dotenvConversionConfig: {
                            parsed: {
                                CONVERSION: 'true',
                            },
                        },
                    },
                ),
            )

            parsed.should.deep.equal(expected)
            parsed.should.not.haveOwnProperty('CONVERSION')
            process.env.should.deep.include(expectedProcessEnv)
            process.env.should.not.haveOwnProperty('CONVERSION')
            process.env.should.not.haveOwnProperty('VARIABLE_1')
            process.env.should.not.haveOwnProperty('VARIABLE_2')
            process.env.should.not.haveOwnProperty('VARIABLE_NULL')
            expect(get('VARIABLE_1000')).to.be.a('null')

            done()
        })

        it('get a variable', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // existing variable
            get('VARIABLE_1').should.equal(expected.VARIABLE_1)
            get('VARIABLE_2').should.equal(expected.VARIABLE_2)
            get('VARIABLE_NULL', 'default null').should.equal('default null')
            get('VARIABLE_100').should.equal(expectedProcessEnv.VARIABLE_100)

            // none-existing variable
            expect(process.env.VARIABLE_3).to.be.an('undefined')
            expect(get('VARIABLE_3')).to.be.a('null')
            get('VARIABLE_3', 'default 3').should.equal('default 3')

            done()
        })

        it('get all', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }
            const expectedAll = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // all
            get().should.deep.include(expectedAll)
            // all with default values
            get(null, {VARIABLE_1: 'default 1', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.include(Object.assign({}, expectedAll, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

            done()
        })

        it('get only', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // only with existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL']).should.deep.equal(expected)
            // only with existing variables and none-existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3']).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {VARIABLE_3: 'default 3'}).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: 'default 3'}),
            )
            // only with existing variables and none-existing variables which don't have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {}).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values 2
            get({VARIABLE_1: 'default 1', VARIABLE_2: 'default 2', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.equal(Object.assign({}, expected, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

            done()
        })
    })

    describe('pack:dotenv', function () {
        const dotEnvPath = './.env'
        after(() => {
            fs.rmSync(dotEnvPath)
        })

        function useEnv(useFile = true) {
            useFile && fs.copyFileSync(`./tests/inputs/.env`, dotEnvPath)
            return dotenvPacked.pack({
                useFlow: false,
                dotenvConfig: {},
            })
        }

        it('parsed:error', function (done) {
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            try {
                Object.assign(process.env, inputProcessEnv)
                const {parsed} = useEnv(false)
            }
            catch (e) {
                e.should.equal('Cannot load .env file')
            }

            done()
        })

        it('parsed', function (done) {
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv()

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedProcessEnv)

            done()
        })

        it('get a variable', function (done) {
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // existing variable
            get('VARIABLE_1').should.equal(expected.VARIABLE_1)
            get('VARIABLE_2').should.equal(expected.VARIABLE_2)
            get('VARIABLE_NULL', 'default null').should.equal('default null')
            get('VARIABLE_100').should.equal(expectedProcessEnv.VARIABLE_100)

            // none-existing variable
            expect(process.env.VARIABLE_3).to.be.an('undefined')
            expect(get('VARIABLE_3')).to.be.a('null')
            get('VARIABLE_3', 'default 3').should.equal('default 3')

            done()
        })

        it('get all', function (done) {
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }
            const expectedAll = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv())

            // all
            get().should.deep.include(expectedAll)
            // all with default values
            get(null, {VARIABLE_1: 'default 1', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.include(Object.assign({}, expectedAll, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

            done()
        })

        it('get only', function (done) {
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // only with existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL']).should.deep.equal(expected)
            // only with existing variables and none-existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3']).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {VARIABLE_3: 'default 3'}).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: 'default 3'}),
            )
            // only with existing variables and none-existing variables which don't have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {}).should.deep.equal(
                Object.assign({}, expected, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values 2
            get({VARIABLE_1: 'default 1', VARIABLE_2: 'default 2', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.equal(Object.assign({}, expected, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

            done()
        })
    })

    describe('pack:dotenv-flow', function () {
        const dotEnvPath = './.env'
        after(() => {
            fs.rmSync(dotEnvPath)
            fs.rmSync(`${dotEnvPath}.local`)
            fs.rmSync(`${dotEnvPath}.test`)
            fs.rmSync(`${dotEnvPath}.test.local`)
        })

        function useEnv(level = 0) {
            level === 1 && fs.copyFileSync(`./tests/inputs/flow.env`, dotEnvPath)
            level > 1 && fs.copyFileSync(`./tests/inputs/flow.env.local`, `${dotEnvPath}.local`)
            level > 2 && fs.copyFileSync(`./tests/inputs/flow.env.test`, `${dotEnvPath}.test`)
            level > 3 && fs.copyFileSync(`./tests/inputs/flow.env.test.local`, `${dotEnvPath}.test.local`)
            return dotenvPacked.pack()
        }

        it('flow:error', function (done) {
            const input = 0
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'variable 100',
            }

            try {
                Object.assign(process.env, inputProcessEnv)
                const {parsed} = useEnv(input)
            }
            catch (e) {
                e.should.equal('Cannot load .env file')
            }

            done()
        })

        it('flow:env', function (done) {
            const input = 1
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.local', function (done) {
            const input = 2
            const inputProcessEnv = {
                VARIABLE_100: 'local 100',
            }

            const expected = {
                VARIABLE_1: 'local 1',
                VARIABLE_2: 'local 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'local 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.test', function (done) {
            process.env.NODE_ENV = 'test'
            const input = 3
            const inputProcessEnv = {
                VARIABLE_100: 'test 100',
            }

            const expected = {
                VARIABLE_1: 'test 1',
                VARIABLE_2: 'test 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'test 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.test.local', function (done) {
            process.env.NODE_ENV = 'test'
            const input = 4
            const inputProcessEnv = {
                VARIABLE_100: 'test local 100',
            }

            const expected = {
                VARIABLE_1: 'test local 1',
                VARIABLE_2: 'test local 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'test local 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            parsed.should.deep.equal(expected)
            process.env.should.deep.include(expectedProcessEnv)

            done()
        })
    })
})
