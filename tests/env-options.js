import chai from 'chai'
import envOptions from '../src/env-options'
import mocha from 'mocha'

const before = mocha.before
const beforeEach = mocha.beforeEach
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

describe('env-options', function () {
    describe('no-env', function () {
        it('no-env', function (done) {
            const input = {}

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('no-passed-env', function (done) {
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions()

            options.should.deep.equal(expected)

            done()
        })
    })

    describe('dotenv', function () {
        it('path', function (done) {
            process.env.DOTENV_CONFIG_PATH = '/custom/path/to/your/env/vars'

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    path: '/custom/path/to/your/env/vars',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('encoding', function (done) {
            process.env.DOTENV_CONFIG_ENCODING = 'latin1'

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    encoding: 'latin1',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('debug', function (done) {
            process.env.DOTENV_CONFIG_DEBUG = 'true'

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    debug: 'true',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('override', function (done) {
            process.env.DOTENV_CONFIG_OVERRIDE = 'true'

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    override: 'true',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('DOTENV_KEY', function (done) {
            process.env.DOTENV_CONFIG_DOTENV_KEY = 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production'

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    DOTENV_KEY: 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('empty', function (done) {
            process.env.DOTENV_CONFIG_PATH = ''
            process.env.DOTENV_CONFIG_ENCODING = ''
            process.env.DOTENV_CONFIG_DEBUG = ''
            process.env.DOTENV_CONFIG_OVERRIDE = ''
            process.env.DOTENV_CONFIG_DOTENV_KEY = ''

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('not-set', function (done) {
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })
    })

    describe('dotenv-flow', function () {
        it('use-flow', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = 'true'

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })
        it('use-flow:false', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = 'false'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:no', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = 'no'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:not', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = 'not'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:none', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = 'none'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:0', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = '0.1'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:.', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = '.1'

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:any', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = '1.1'

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:empty', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = ''

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = ''
            process.env.NODE_ENV = 'test'

            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env:empty', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = ''
            process.env.NODE_ENV = ''

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env:not-set', function (done) {
            process.env.DOTENV_PACKED_USE_FLOW = ''

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = envOptions(process.env)

            options.should.deep.equal(expected)

            done()
        })
    })
})
