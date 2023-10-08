import dotenvOptions from 'dotenv/lib/env-options'

export default function (env = process.env) {
    const options = {}

    options.useFlow = 'DOTENV_PACKED_USE_FLOW' in env
        && (useFlow => !['false', 'no', 'not', 'none'].includes(useFlow) || /^\.?0/.test(useFlow))(env.DOTENV_PACKED_USE_FLOW.toLowerCase()) 

    if (options.useFlow) {
        const dotenvFlowOptions = {}
        if ('NODE_ENV' in env) {
            dotenvFlowOptions.node_env = env.NODE_ENV
        }
        options.dotenvOptions = dotenvFlowOptions
    }
    else {
        options.dotenvOptions = Object.assign({}, dotenvOptions)
    }

    return options
}
