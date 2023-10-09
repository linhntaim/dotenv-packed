import dotenvOptions from 'dotenv/lib/cli-options'

export default function (argv = process.argv) {
    const options = {}

    options.useFlow = argv.includes('--use-flow')

    if (options.useFlow) {
        const dotenvFlowOptions = {}
        const nodeEnvArg = '--node-env'
        argv.some((arg, index) => {
            if (arg === nodeEnvArg) {
                if (index + 1 < argv.length) {
                    dotenvFlowOptions.node_env = argv[index + 1]
                    return true
                }
            }
            else if (arg.startsWith(`${nodeEnvArg}=`)) {
                const nodeEnv = arg.substring(nodeEnvArg.length + 1)
                if (nodeEnv !== '') {
                    dotenvFlowOptions.node_env = nodeEnv
                    return true
                }
            }
            return false
        })
        options.dotenvOptions = dotenvFlowOptions
    }
    else {
        options.dotenvOptions = Object.assign({}, dotenvOptions(argv))
    }

    return options
}
