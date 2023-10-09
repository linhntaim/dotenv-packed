import chai from 'chai'
import dotenvPacked from '../dist'
import fs from 'fs'
import mocha from 'mocha'

const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

const originEnv = {...process.env}

describe('dotenv-packed', function () {
    afterEach(() => {
        process.env = {...originEnv}
    })

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
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '4.5e1',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,4.5e1,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":4.5e1,"d":"x"}',
                VARIABLE_EXPAND: 'boolean:$VARIABLE_NUMBER',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed, get} = dotenvPacked.pack(
                Object.assign(
                    {},
                    useEnv(input),
                    {
                        dotenvExpandOptions: {},
                        dotenvConversionOptions: {
                            parsed: {
                                CONVERSION: 'true',
                            },
                        },
                    },
                ),
            )

            parsed.should.deep.include(expected)
            parsed.VARIABLE_SYMBOL.should.be.a('symbol')
            parsed.VARIABLE_SYMBOL.toString().should.equal(expectedVariableSymbol.toString())
            parsed.should.not.haveOwnProperty('CONVERSION')
            process.env.should.deep.include(expectedProcessEnv)
            process.env.should.not.haveOwnProperty('CONVERSION')
            expect(get('VARIABLE_1000')).to.be.a('null')

            done()
        })

        it('parsed:ignore-process-env', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '4.5e1',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,4.5e1,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":4.5e1,"d":"x"}',
                VARIABLE_EXPAND: 'boolean:$VARIABLE_NUMBER',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
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
                        dotenvExpandOptions: {},
                        dotenvConversionOptions: {
                            parsed: {
                                CONVERSION: 'true',
                            },
                        },
                    },
                ),
            )

            parsed.should.deep.include(expected)
            parsed.VARIABLE_SYMBOL.should.be.a('symbol')
            parsed.VARIABLE_SYMBOL.toString().should.equal(expectedVariableSymbol.toString())
            parsed.should.not.haveOwnProperty('CONVERSION')
            process.env.should.deep.include(expectedProcessEnv)
            process.env.should.not.haveOwnProperty('CONVERSION')
            process.env.should.not.haveOwnProperty('VARIABLE_1')
            process.env.should.not.haveOwnProperty('VARIABLE_2')
            process.env.should.not.haveOwnProperty('VARIABLE_NULL')
            process.env.should.not.haveOwnProperty('VARIABLE_UNDEFINED')
            process.env.should.not.haveOwnProperty('VARIABLE_BOOLEAN')
            process.env.should.not.haveOwnProperty('VARIABLE_NUMBER')
            process.env.should.not.haveOwnProperty('VARIABLE_BIGINT')
            process.env.should.not.haveOwnProperty('VARIABLE_EMPTY')
            process.env.should.not.haveOwnProperty('VARIABLE_ARRAY')
            process.env.should.not.haveOwnProperty('VARIABLE_OBJECT')
            process.env.should.not.haveOwnProperty('VARIABLE_EXPAND')
            expect(get('VARIABLE_1000')).to.be.a('null')

            done()
        })

        it('get a variable', function (done) {
            const input = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '4.5e1',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,4.5e1,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":4.5e1,"d":"x"}',
                VARIABLE_EXPAND: 'boolean:$VARIABLE_NUMBER',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // existing variable
            get('VARIABLE_1').should.equal(expected.VARIABLE_1)
            get('VARIABLE_2').should.equal(expected.VARIABLE_2)
            get('VARIABLE_NULL', 'default null').should.equal('default null')
            get('VARIABLE_EMPTY', 'default empty').should.equal('')
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
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '4.5e1',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,4.5e1,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":4.5e1,"d":"x"}',
                VARIABLE_EXPAND: 'boolean:$VARIABLE_NUMBER',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }
            const expectedAll = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // all
            get().should.deep.include(expectedAll)
            get().VARIABLE_SYMBOL.should.be.a('symbol')
            get().VARIABLE_SYMBOL.toString().should.equal(expectedVariableSymbol.toString())
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
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '4.5e1',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,4.5e1,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":4.5e1,"d":"x"}',
                VARIABLE_EXPAND: 'boolean:$VARIABLE_NUMBER',
            }
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }
            const expectedOnly = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // only with existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL']).should.deep.equal(expectedOnly)
            // only with existing variables and none-existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3']).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {VARIABLE_3: 'default 3'}).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}),
            )
            // only with existing variables and none-existing variables which don't have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {}).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values 2
            get({VARIABLE_1: 'default 1', VARIABLE_2: 'default 2', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

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
                dotenvOptions: {},
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv()

            parsed.should.deep.include(expected)
            parsed.VARIABLE_SYMBOL.should.be.a('symbol')
            parsed.VARIABLE_SYMBOL.toString().should.equal(expectedVariableSymbol.toString())
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // existing variable
            get('VARIABLE_1').should.equal(expected.VARIABLE_1)
            get('VARIABLE_2').should.equal(expected.VARIABLE_2)
            get('VARIABLE_NULL', 'default null').should.equal('default null')
            get('VARIABLE_EMPTY', 'default empty').should.equal('')
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }
            const expectedAll = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
                VARIABLE_100: 'variable 100',
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv())

            // all
            get().should.deep.include(expectedAll)
            get().VARIABLE_SYMBOL.should.be.a('symbol')
            get().VARIABLE_SYMBOL.toString().should.equal(expectedVariableSymbol.toString())
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_BOOLEAN: true,
                VARIABLE_NUMBER: 45,
                VARIABLE_BIGINT: 1n,
                VARIABLE_EMPTY: '',
                VARIABLE_ARRAY: [null, true, 45, 'x'],
                VARIABLE_OBJECT: {'a': null, 'b': true, 'c': 45, 'd': 'x'},
                VARIABLE_EXPAND: true,
            }
            const expectedVariableSymbol = Symbol('a')
            const expectedProcessEnv = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: 'null',
                VARIABLE_UNDEFINED: 'undefined',
                VARIABLE_BOOLEAN: 'true',
                VARIABLE_NUMBER: '45',
                VARIABLE_BIGINT: '1n',
                VARIABLE_EMPTY: '',
                VARIABLE_SYMBOL: 'Symbol(a)',
                VARIABLE_ARRAY: '[null,true,45,"x"]',
                VARIABLE_OBJECT: '{"a":null,"b":true,"c":45,"d":"x"}',
                VARIABLE_EXPAND: 'true',
                VARIABLE_100: 'variable 100',
            }
            const expectedOnly = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
                VARIABLE_NULL: null,
            }

            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // only with existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL']).should.deep.equal(expectedOnly)
            // only with existing variables and none-existing variables
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3']).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {VARIABLE_3: 'default 3'}).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}),
            )
            // only with existing variables and none-existing variables which don't have default values
            get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_3'], {}).should.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existing variables and none-existing variables which have default values 2
            get({VARIABLE_1: 'default 1', VARIABLE_2: 'default 2', VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'})
                .should.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_NULL: 'default null', VARIABLE_3: 'default 3'}))

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
