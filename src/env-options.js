export default function (env = process.env) {
    const nullOrEmpty = name => !(name in env) || env[name] === ''

    const options = {}

    options.useFlow = 'DOTENV_PACKED_USE_FLOW' in env
        && (useFlow => !(['false', 'no', 'not', 'none'].includes(useFlow) || /^((0+(\..*)?)|(\..*))$/.test(useFlow)))(env.DOTENV_PACKED_USE_FLOW.toLowerCase())

    if (options.useFlow) {
        const dotenvFlowOptions = {}
        if (!nullOrEmpty('NODE_ENV')) {
            dotenvFlowOptions.node_env = env.NODE_ENV
        }
        options.dotenvOptions = dotenvFlowOptions
    }
    else {
        const dotenvOptions = {}

        if (!nullOrEmpty('DOTENV_CONFIG_ENCODING')) {
            dotenvOptions.encoding = env.DOTENV_CONFIG_ENCODING
        }
        if (!nullOrEmpty('DOTENV_CONFIG_PATH')) {
            dotenvOptions.path = env.DOTENV_CONFIG_PATH
        }
        if (!nullOrEmpty('DOTENV_CONFIG_DEBUG')) {
            dotenvOptions.debug = env.DOTENV_CONFIG_DEBUG
        }
        if (!nullOrEmpty('DOTENV_CONFIG_OVERRIDE')) {
            dotenvOptions.override = env.DOTENV_CONFIG_OVERRIDE
        }
        if (!nullOrEmpty('DOTENV_CONFIG_DOTENV_KEY')) {
            dotenvOptions.DOTENV_KEY = env.DOTENV_CONFIG_DOTENV_KEY
        }
        options.dotenvOptions = dotenvOptions
    }

    return options
}
