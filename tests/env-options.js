import chai from 'chai'
import mocha from 'mocha'
import envOptions from '../src/env-options'

// const before = mocha.before
// const beforeEach = mocha.beforeEach
// const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

const originEnv = {...process.env}

describe('env-options', function () {
    // before(() => {
    // })
    // beforeEach(() => {
    // })
    // after(() => {
    // })
    afterEach(() => {
        process.env = {...originEnv}
    })

    describe('no-env', function () {
        it('no-env', function (done) {
            // inputs
            const input = {}

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('no-passed-env', function (done) {
            // inputs

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions()

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })

    describe('dotenv', function () {
        it('path', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_PATH = '/custom/path/to/your/env/vars'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    path: '/custom/path/to/your/env/vars',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('encoding', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_ENCODING = 'latin1'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    encoding: 'latin1',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('debug', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_DEBUG = 'true'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    debug: 'true',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('override', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_OVERRIDE = 'true'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    override: 'true',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('DOTENV_KEY', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_DOTENV_KEY = 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    DOTENV_KEY: 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('empty', function (done) {
            // inputs
            process.env.DOTENV_CONFIG_PATH = ''
            process.env.DOTENV_CONFIG_ENCODING = ''
            process.env.DOTENV_CONFIG_DEBUG = ''
            process.env.DOTENV_CONFIG_OVERRIDE = ''
            process.env.DOTENV_CONFIG_DOTENV_KEY = ''

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('not-set', function (done) {
            // inputs

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })

    describe('dotenv-flow', function () {
        it('use-flow', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = 'true'

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
        it('use-flow:false', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = 'false'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:no', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = 'no'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:not', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = 'not'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:none', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = 'none'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:0', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = '0.1'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:.', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = '.1'

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:any', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = '1.1'

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:empty', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = ''

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = ''
            process.env.NODE_ENV = 'test'

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env:empty', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = ''
            process.env.NODE_ENV = ''

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env:not-set', function (done) {
            // inputs
            process.env.DOTENV_PACKED_USE_FLOW = ''

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = envOptions(process.env)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })
})
