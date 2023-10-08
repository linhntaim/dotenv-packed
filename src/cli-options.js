import dotenvOptions from 'dotenv/lib/cli-options'

export default function (argv = process.argv) {
    const options = {}

    options.useFlow = argv.includes('--use-flow')

    if (options.useFlow) {
        const dotenvFlowOptions = {}
        const nodeEnvArg = '--node-env'
        argv.some((arg, index) => {
            if (arg === nodeEnvArg) {
                dotenvFlowOptions.node_env = argv[index + 1]
                return true
            }
            if (arg.startsWith(`${nodeEnvArg}=`)) {
                dotenvFlowOptions.node_env = arg.substring(nodeEnvArg.length + 1)
                return true
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
