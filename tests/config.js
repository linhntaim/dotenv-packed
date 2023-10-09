import chai from 'chai'
import cp from 'child_process'
import mocha from 'mocha'
import path from 'path'
import fs from 'fs'
import dotenvPacked from '../dist'

const before = mocha.before
const beforeEach = mocha.beforeEach
const after = mocha.after
const afterEach = mocha.afterEach
const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

describe('config', function () {
    function spawn(cmd, options = {}) {
        const {stdout} = cp.spawnSync(
            process.argv[0], // node binary
            cmd,
            Object.assign(
                {},
                {
                    cwd: path.resolve(__dirname, '..'),
                    timeout: 5000,
                    encoding: 'utf8',
                },
                options,
            ),
        )

        return stdout
    }

    const indexLocalFile = './index.local.js'
    before(() => {
        console.log('before')
        fs.copyFileSync(`./tests/inputs/index.local.js`, indexLocalFile)
    })
    after(() => {
        console.log('after')
        fs.existsSync(indexLocalFile) && fs.rmSync(indexLocalFile)
    })

    describe('dotenv', function () {
        const dotEnvFilePath = './.env'
        after(() => {
            fs.existsSync(dotEnvFilePath) && fs.rmSync(dotEnvFilePath)
        })

        function useEnv() {
            fs.copyFileSync(`./tests/inputs/.env`, dotEnvFilePath)
        }

        it('parsed:error', function (done) {
            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                ],
            )

            output.should.equal('')

            done()
        })

        it('parsed', function (done) {
            useEnv(true)

            const expected = '{\n' +
                '  VARIABLE_1: \'variable 1\',\n' +
                '  VARIABLE_2: \'variable 2\',\n' +
                '  VARIABLE_NULL: null,\n' +
                '  VARIABLE_UNDEFINED: undefined,\n' +
                '  VARIABLE_BOOLEAN: true,\n' +
                '  VARIABLE_NUMBER: 45,\n' +
                '  VARIABLE_BIGINT: 1n,\n' +
                '  VARIABLE_EMPTY: \'\',\n' +
                '  VARIABLE_SYMBOL: Symbol(a),\n' +
                '  VARIABLE_ARRAY: [ null, true, 45, \'x\' ],\n' +
                '  VARIABLE_OBJECT: { a: null, b: true, c: 45, d: \'x\' },\n' +
                '  VARIABLE_EXPAND: true\n' +
                '}\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                ],
            )

            output.should.equal(expected)

            done()
        })
    })

    describe('dotenv-flow', function () {
        const dotEnvFilePath = './.env'
        after(() => {
            fs.existsSync(dotEnvFilePath) && fs.rmSync(dotEnvFilePath)
            fs.existsSync(`${dotEnvFilePath}.local`) && fs.rmSync(`${dotEnvFilePath}.local`)
            fs.existsSync(`${dotEnvFilePath}.test`) && fs.rmSync(`${dotEnvFilePath}.test`)
            fs.existsSync(`${dotEnvFilePath}.test.local`) && fs.rmSync(`${dotEnvFilePath}.test.local`)
        })

        function useEnv(level = 0) {
            level === 1 && fs.copyFileSync(`./tests/inputs/flow.env`, dotEnvFilePath)
            level > 1 && fs.copyFileSync(`./tests/inputs/flow.env.local`, `${dotEnvFilePath}.local`)
            level > 2 && fs.copyFileSync(`./tests/inputs/flow.env.test`, `${dotEnvFilePath}.test`)
            level > 3 && fs.copyFileSync(`./tests/inputs/flow.env.test.local`, `${dotEnvFilePath}.test.local`)
        }

        it('flow:error', function (done) {
            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                ],
            )

            output.should.equal('')

            done()
        })

        it('flow:env', function (done) {
            useEnv(1)

            const expected = '{ VARIABLE_1: \'variable 1\', VARIABLE_2: \'variable 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                ],
            )

            output.should.equal(expected)

            done()
        })

        it('flow:env.local', function (done) {
            useEnv(2)

            const expected = '{ VARIABLE_1: \'local 1\', VARIABLE_2: \'local 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                ],
            )

            output.should.equal(expected)

            done()
        })

        it('flow:env.test', function (done) {
            useEnv(3)

            const expected = '{ VARIABLE_1: \'test 1\', VARIABLE_2: \'test 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                    '--node-env=test',
                ],
            )

            output.should.equal(expected)

            done()
        })

        it('flow:env.test*2', function (done) {
            useEnv(3)

            const expected = '{ VARIABLE_1: \'test 1\', VARIABLE_2: \'test 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                    '--node-env',
                    'test',
                ],
            )

            output.should.equal(expected)

            done()
        })

        it('flow:env.test.local', function (done) {
            useEnv(4)

            const expected = '{ VARIABLE_1: \'test local 1\', VARIABLE_2: \'test local 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                    '--node-env=test',
                ],
            )

            output.should.equal(expected)

            done()
        })

        it('flow:env.test.local*2', function (done) {
            useEnv(4)

            const expected = '{ VARIABLE_1: \'test local 1\', VARIABLE_2: \'test local 2\' }\n'

            const output = spawn(
                [
                    '-r',
                    './config',
                    indexLocalFile,
                    '--use-flow',
                    '--node-env',
                    'test',
                ],
            )

            output.should.equal(expected)

            done()
        })
    })
})
