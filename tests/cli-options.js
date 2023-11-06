import chai from 'chai'
import mocha from 'mocha'
import cliOptions from '../src/cli-options'

// const before = mocha.before
// const beforeEach = mocha.beforeEach
// const after = mocha.after
// const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

describe('cli-options', function () {
    // before(() => {
    // })
    // beforeEach(() => {
    // })
    // after(() => {
    // })
    // afterEach(() => {
    // })

    describe('no-args', function () {
        it('no-args', function (done) {
            // inputs
            const input = []

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('no-passed-args', function (done) {
            // inputs

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions()

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })

    describe('dotenv', function () {
        it('path', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_path=/custom/path/to/your/env/vars']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    path: '/custom/path/to/your/env/vars',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('encoding', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_encoding=latin1']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    encoding: 'latin1',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('debug', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_debug=true']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    debug: 'true',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('override', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_override=true']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    override: 'true',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('DOTENV_KEY', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_DOTENV_KEY=dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {
                    DOTENV_KEY: 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('option:empty', function (done) {
            // inputs
            const input = [
                'node',
                '-e',
                '\'console.log(testing)\'',
                'dotenv_config_path=',
                'dotenv_config_encoding=',
                'dotenv_config_debug=',
                'dotenv_config_override=',
                'dotenv_config_DOTENV_KEY=',
            ]

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('option:case-sensitive', function (done) {
            // inputs
            const input = [
                'node',
                '-e',
                '\'console.log(testing)\'',
                'dotenv_config_PATH=',
                'dotenv_config_ENCODING=',
                'dotenv_config_DEBUG=',
                'dotenv_config_OVERRIDE=',
                'dotenv_config_dotenv_key=',
            ]

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('not-an-option', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_foo=bar']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })

    describe('dotenv-flow', function () {
        it('use-flow', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('use-flow:case-sensitive', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--USE-FLOW']

            // expected outputs
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env', 'test']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env:empty', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env:case-sensitive', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--NODE-ENV', 'test']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env=', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env=test']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env=empty', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env=']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })

        it('node_env=case-sensitive', function (done) {
            // inputs
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--NODE-ENV=test']

            // expected outputs
            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            // executes
            const options = cliOptions(input)

            // asserts
            expect(options).to.deep.equal(expected)

            done()
        })
    })
})
