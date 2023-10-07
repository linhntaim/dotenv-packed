import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import dotenvFlow from 'dotenv-flow'
import dotenvConversion from 'dotenv-conversion'

function removeParsed(config) {
    if ('parsed' in config) {
        delete config.parsed
    }
    return config
}

function load(flow, dotenvFlowConfig, dotenvConfig) {
    const result = flow ? dotenvFlow.config(dotenvFlowConfig) : dotenv.config(dotenvConfig)
    if ('error' in result) {
        throw result.error
    }
    return result
}

function createResult(parsed, config) {
    return {
        parsed,
        /**
         *
         * @param {string} name
         * @param {*|null} defaultValue
         * @returns {*|null}
         */
        get(name, defaultValue = null) {
            if (name in parsed.env) {
                return parsed[name]
            }
            if (!config.ignoreProcessEnv && name in process.env) {
                return process.env[name]
            }
            return defaultValue
        },
    }
}

function pack(config = {}) {
    const dotenvConfig = 'parsed' in config ? {
        parsed: config.parsed,
    } : load(
        'flow' in config ? config.flow : true,
        'dotenvFlowConfig' in config ? config.dotenvFlowConfig : {},
        'dotenvConfig' in config ? config.dotenvConfig : {},
    )
    const dotenvExpandConfig = 'dotenvExpandConfig' in config ? removeParsed(config.dotenvExpandConfig) : {}
    const dotenvConversionConfig = 'dotenvConversionConfig' in config ? removeParsed(config.dotenvConversionConfig) : {}
    if (!('ignoreProcessEnv' in config)) {
        config.ignoreProcessEnv = false
    }
    dotenvExpandConfig.ignoreProcessEnv = config.ignoreProcessEnv
    dotenvConversionConfig.ignoreProcessEnv = config.ignoreProcessEnv

    return createResult(
        dotenvConversion.convert(
            Object.assign(
                {},
                dotenvExpand.expand(
                    Object.assign(
                        {},
                        dotenvConfig,
                        dotenvExpandConfig,
                    ),
                ),
                dotenvConversionConfig,
            ),
        ).parsed,
        {
            ignoreProcessEnv: config.ignoreProcessEnv,
        },
    )
}

export default {pack}
