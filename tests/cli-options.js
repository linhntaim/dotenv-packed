import chai from 'chai'
import cliOptions from '../src/cli-options'
import mocha from 'mocha'

const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

describe('cli-options', function () {
    describe('no-args', function () {
        it('no-args', function (done) {
            const input = []

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('no-passed-args', function (done) {
            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions()

            options.should.deep.equal(expected)

            done()
        })
    })

    describe('dotenv', function () {
        it('path', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_path=/custom/path/to/your/env/vars']

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    path: '/custom/path/to/your/env/vars',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('encoding', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_encoding=latin1']

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    encoding: 'latin1',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('debug', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_debug=true']

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    debug: 'true',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('override', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_override=true']

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    override: 'true',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('DOTENV_KEY', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_DOTENV_KEY=dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production']

            const expected = {
                useFlow: false,
                dotenvOptions: {
                    DOTENV_KEY: 'dotenv://:key_1234…@dotenv.org/vault/.env.vault?environment=production',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('option:empty', function (done) {
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

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('option:case-sensitive', function (done) {
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

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('not-an-option', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', 'dotenv_config_foo=bar']

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })
    })

    describe('dotenv-flow', function () {
        it('use-flow', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow']

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('use-flow:case-sensitive', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--USE-FLOW']

            const expected = {
                useFlow: false,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env', 'test']

            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env:empty', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env']

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env:case-sensitive', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--NODE-ENV', 'test']

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env=', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env=test']

            const expected = {
                useFlow: true,
                dotenvOptions: {
                    node_env: 'test',
                },
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env=empty', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--node-env=']

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })

        it('node_env=case-sensitive', function (done) {
            const input = ['node', '-e', '\'console.log(testing)\'', '--use-flow', '--NODE-ENV=test']

            const expected = {
                useFlow: true,
                dotenvOptions: {},
            }

            const options = cliOptions(input)

            options.should.deep.equal(expected)

            done()
        })
    })
})
