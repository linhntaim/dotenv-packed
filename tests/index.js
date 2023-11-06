import chai from 'chai'
import fs from 'fs'
import mocha from 'mocha'
import dotenvPacked from '../src'

// const before = mocha.after
// const beforeEach = mocha.beforeEach
const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const originEnv = {...process.env}

describe('dotenv-packed', function () {
    // before(() => {
    // })
    // beforeEach(() => {
    // })
    // after(() => {
    // })
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
            // inputs
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

            // expected outputs
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

            // executes
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

            // asserts
            expect(parsed).to.deep.include(expected)
            expect(parsed.VARIABLE_SYMBOL).to.be.a('symbol')
            expect(parsed.VARIABLE_SYMBOL.toString()).to.equal(expectedVariableSymbol.toString())
            expect(parsed).to.not.haveOwnProperty('CONVERSION')
            expect(process.env).to.deep.include(expectedProcessEnv)
            expect(process.env).to.not.haveOwnProperty('CONVERSION')
            expect(get('VARIABLE_1000')).to.be.a('null')

            done()
        })

        it('parsed:ignore-process-env', function (done) {
            // inputs
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

            // expected outputs
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

            // executes
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

            // asserts
            expect(parsed).to.deep.include(expected)
            expect(parsed.VARIABLE_SYMBOL).to.be.a('symbol')
            expect(parsed.VARIABLE_SYMBOL.toString()).to.equal(expectedVariableSymbol.toString())
            expect(parsed).to.not.haveOwnProperty('CONVERSION')
            expect(process.env).to.deep.include(expectedProcessEnv)
            expect(process.env).to.not.haveOwnProperty('CONVERSION')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_1')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_2')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_NULL')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_UNDEFINED')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_BOOLEAN')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_NUMBER')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_BIGINT')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_EMPTY')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_ARRAY')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_OBJECT')
            expect(process.env).to.not.haveOwnProperty('VARIABLE_EXPAND')
            expect(get('VARIABLE_1000')).to.be.a('null')

            done()
        })

        it('get a variable', function (done) {
            // inputs
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

            // expected outputs
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

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // asserts
            // existent variable
            expect(get('VARIABLE_1')).to.equal(expected.VARIABLE_1)
            expect(get('VARIABLE_2')).to.equal(expected.VARIABLE_2)
            expect(get('VARIABLE_NULL')).to.be.a('null')
            expect(get('VARIABLE_NULL', 'default null')).to.be.a('null')
            expect(get('VARIABLE_UNDEFINED')).to.be.an('undefined')
            expect(get('VARIABLE_UNDEFINED', 'default undefined')).to.be.an('undefined')
            expect(get('VARIABLE_BOOLEAN')).to.equal(expected.VARIABLE_BOOLEAN)
            expect(get('VARIABLE_NUMBER')).to.equal(expected.VARIABLE_NUMBER)
            expect(get('VARIABLE_BIGINT')).to.equal(expected.VARIABLE_BIGINT)
            expect(get('VARIABLE_EMPTY')).to.equal(expected.VARIABLE_EMPTY)
            expect(get('VARIABLE_EMPTY', 'default empty')).to.equal(expected.VARIABLE_EMPTY)
            expect(get('VARIABLE_SYMBOL')).to.be.a('symbol')
            expect(get('VARIABLE_SYMBOL').toString()).to.equal(expectedVariableSymbol.toString())
            expect(get('VARIABLE_ARRAY')).to.deep.equal(expected.VARIABLE_ARRAY)
            expect(get('VARIABLE_OBJECT')).to.deep.equal(expected.VARIABLE_OBJECT)
            expect(get('VARIABLE_100')).to.equal(expectedProcessEnv.VARIABLE_100)
            // non-existent variable
            expect(process.env.VARIABLE_3).to.be.an('undefined')
            expect(get('VARIABLE_3')).to.be.a('null')
            get('VARIABLE_3', expect('default 3')).to.equal('default 3')

            done()
        })

        it('get all', function (done) {
            // inputs
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

            // expected outputs
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

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // asserts
            // all
            expect(get()).to.deep.include(expectedAll)
            expect(get().VARIABLE_SYMBOL).to.be.a('symbol')
            expect(get().VARIABLE_SYMBOL.toString()).to.equal(expectedVariableSymbol.toString())
            // all with default values
            expect(
                get(
                    null,
                    {
                        VARIABLE_NULL: 'default null',
                        VARIABLE_UNDEFINED: 'default undefined',
                        VARIABLE_EMPTY: 'default empty',
                        VARIABLE_3: 'default 3',
                    },
                ),
            ).to.deep.include(Object.assign({}, expectedAll, {VARIABLE_3: 'default 3'}))

            done()
        })

        it('get only', function (done) {
            // inputs
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

            // expected outputs
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_EMPTY: '',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv(input))

            // asserts
            // only with existent variables
            expect(get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY'])).to.deep.equal(expectedOnly)
            // only with existent variables and non-existent variables
            expect(get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY', 'VARIABLE_3'])).to.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existent variables and non-existent variables which have default values
            expect(
                get(
                    ['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY', 'VARIABLE_3'],
                    {
                        VARIABLE_1: 'default 1',
                        VARIABLE_2: 'default 2',
                        VARIABLE_NULL: 'default null',
                        VARIABLE_UNDEFINED: 'default undefined',
                        VARIABLE_EMPTY: 'default empty',
                        VARIABLE_3: 'default 3',
                    },
                ),
            ).to.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}))
            // only with existent variables and non-existent variables which have default values 2
            expect(
                get({
                    VARIABLE_1: 'default 1',
                    VARIABLE_2: 'default 2',
                    VARIABLE_NULL: 'default null',
                    VARIABLE_UNDEFINED: 'default undefined',
                    VARIABLE_EMPTY: 'default empty',
                    VARIABLE_3: 'default 3',
                }),
            ).to.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}))

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
            // inputs
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
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
                // executes
                Object.assign(process.env, inputProcessEnv)
                const {parsed} = useEnv(false)
            }
            catch (e) {
                // asserts
                expect(e).to.equal('Cannot load .env file')
            }

            done()
        })

        it('parsed', function (done) {
            // inputs
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
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

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv()

            // asserts
            expect(parsed).to.deep.include(expected)
            expect(parsed.VARIABLE_SYMBOL).to.be.a('symbol')
            expect(parsed.VARIABLE_SYMBOL.toString()).to.equal(expectedVariableSymbol.toString())
            expect(process.env).to.deep.include(expectedProcessEnv)

            done()
        })

        it('get a variable', function (done) {
            // inputs
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
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

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // asserts
            // existent variable
            expect(get('VARIABLE_1')).to.equal(expected.VARIABLE_1)
            expect(get('VARIABLE_2')).to.equal(expected.VARIABLE_2)
            expect(get('VARIABLE_NULL')).to.be.a('null')
            expect(get('VARIABLE_NULL', 'default null')).to.be.a('null')
            expect(get('VARIABLE_UNDEFINED')).to.be.an('undefined')
            expect(get('VARIABLE_UNDEFINED', 'default undefined')).to.be.an('undefined')
            expect(get('VARIABLE_BOOLEAN')).to.equal(expected.VARIABLE_BOOLEAN)
            expect(get('VARIABLE_NUMBER')).to.equal(expected.VARIABLE_NUMBER)
            expect(get('VARIABLE_BIGINT')).to.equal(expected.VARIABLE_BIGINT)
            expect(get('VARIABLE_EMPTY')).to.equal(expected.VARIABLE_EMPTY)
            expect(get('VARIABLE_EMPTY', 'default empty')).to.equal(expected.VARIABLE_EMPTY)
            expect(get('VARIABLE_SYMBOL')).to.be.a('symbol')
            expect(get('VARIABLE_SYMBOL').toString()).to.equal(expectedVariableSymbol.toString())
            expect(get('VARIABLE_ARRAY')).to.deep.equal(expected.VARIABLE_ARRAY)
            expect(get('VARIABLE_OBJECT')).to.deep.equal(expected.VARIABLE_OBJECT)
            expect(get('VARIABLE_100')).to.equal(expectedProcessEnv.VARIABLE_100)
            // non-existent variable
            expect(process.env.VARIABLE_3).to.be.an('undefined')
            expect(get('VARIABLE_3')).to.be.a('null')
            get('VARIABLE_3', expect('default 3')).to.equal('default 3')

            done()
        })

        it('get all', function (done) {
            // inputs
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
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

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = dotenvPacked.pack(useEnv())

            // asserts
            // all
            expect(get()).to.deep.include(expectedAll)
            expect(get().VARIABLE_SYMBOL).to.be.a('symbol')
            expect(get().VARIABLE_SYMBOL.toString()).to.equal(expectedVariableSymbol.toString())
            // all with default values
            expect(
                get(
                    null,
                    {
                        VARIABLE_NULL: 'default null',
                        VARIABLE_UNDEFINED: 'default undefined',
                        VARIABLE_EMPTY: 'default empty',
                        VARIABLE_3: 'default 3',
                    },
                ),
            ).to.deep.include(Object.assign({}, expectedAll, {VARIABLE_3: 'default 3'}))

            done()
        })

        it('get only', function (done) {
            // inputs
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
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
                VARIABLE_UNDEFINED: undefined,
                VARIABLE_EMPTY: '',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {get} = useEnv()

            // asserts
            // only with existent variables
            expect(get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY'])).to.deep.equal(expectedOnly)
            // only with existent variables and non-existent variables
            expect(get(['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY', 'VARIABLE_3'])).to.deep.equal(
                Object.assign({}, expectedOnly, {VARIABLE_3: null}),
            )
            // only with existent variables and non-existent variables which have default values
            expect(
                get(
                    ['VARIABLE_1', 'VARIABLE_2', 'VARIABLE_NULL', 'VARIABLE_UNDEFINED', 'VARIABLE_EMPTY', 'VARIABLE_3'],
                    {
                        VARIABLE_1: 'default 1',
                        VARIABLE_2: 'default 2',
                        VARIABLE_NULL: 'default null',
                        VARIABLE_UNDEFINED: 'default undefined',
                        VARIABLE_EMPTY: 'default empty',
                        VARIABLE_3: 'default 3',
                    },
                ),
            ).to.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}))
            // only with existent variables and non-existent variables which have default values 2
            expect(
                get({
                    VARIABLE_1: 'default 1',
                    VARIABLE_2: 'default 2',
                    VARIABLE_NULL: 'default null',
                    VARIABLE_UNDEFINED: 'default undefined',
                    VARIABLE_EMPTY: 'default empty',
                    VARIABLE_3: 'default 3',
                }),
            ).to.deep.equal(Object.assign({}, expectedOnly, {VARIABLE_3: 'default 3'}))

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
            // inputs
            const input = 0
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'variable 100',
            }

            try {
                // executes
                Object.assign(process.env, inputProcessEnv)
                const {parsed} = useEnv(input)
            }
            catch (e) {
                // asserts
                expect(e).to.equal('Cannot load .env file')
            }

            done()
        })

        it('flow:env', function (done) {
            // inputs
            const input = 1
            const inputProcessEnv = {
                VARIABLE_100: 'variable 100',
            }

            // expected outputs
            const expected = {
                VARIABLE_1: 'variable 1',
                VARIABLE_2: 'variable 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'variable 100',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            // asserts
            expect(parsed).to.deep.equal(expected)
            expect(process.env).to.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.local', function (done) {
            // inputs
            const input = 2
            const inputProcessEnv = {
                VARIABLE_100: 'local 100',
            }

            // expected outputs
            const expected = {
                VARIABLE_1: 'local 1',
                VARIABLE_2: 'local 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'local 100',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            // asserts
            expect(parsed).to.deep.equal(expected)
            expect(process.env).to.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.test', function (done) {
            // inputs
            process.env.NODE_ENV = 'test'
            const input = 3
            const inputProcessEnv = {
                VARIABLE_100: 'test 100',
            }

            // expected outputs
            const expected = {
                VARIABLE_1: 'test 1',
                VARIABLE_2: 'test 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'test 100',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            // asserts
            expect(parsed).to.deep.equal(expected)
            expect(process.env).to.deep.include(expectedProcessEnv)

            done()
        })

        it('flow:env.test.local', function (done) {
            // inputs
            process.env.NODE_ENV = 'test'
            const input = 4
            const inputProcessEnv = {
                VARIABLE_100: 'test local 100',
            }

            // expected outputs
            const expected = {
                VARIABLE_1: 'test local 1',
                VARIABLE_2: 'test local 2',
            }
            const expectedProcessEnv = {
                ...expected,
                VARIABLE_100: 'test local 100',
            }

            // executes
            Object.assign(process.env, inputProcessEnv)
            const {parsed} = useEnv(input)

            // asserts
            expect(parsed).to.deep.equal(expected)
            expect(process.env).to.deep.include(expectedProcessEnv)

            done()
        })
    })
})
