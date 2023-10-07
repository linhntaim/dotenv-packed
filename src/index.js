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

function attachDotenvFlowDefaultConfig(config) {
    config.silent = true
    return config
}

function attachDotenvDefaultConfig(config) {
    return config
}

function load(config, useFlow) {
    const result = useFlow
        ? dotenvFlow.config(attachDotenvFlowDefaultConfig(config))
        : dotenv.config(attachDotenvDefaultConfig(config))
    if ('error' in result) {
        throw 'Cannot load .env file'
    }
    return result
}

function createResult(parsed, config) {
    /**
     * @var {object}
     */
    let _memAll

    const _all = function () {
        return {...(_memAll ?? (_memAll = Object.assign({}, process.env, parsed)))}
    }

    /**
     *
     * @param {object|null} defaultValues
     * @returns {object}
     */
    const _getAll = function (defaultValues) {
        const all = _all()
        if (defaultValues !== null) {
            for (const [name, defaultValue] of Object.entries(defaultValues)) {
                all[name] = all[name] ?? defaultValue
            }
        }
        return all
    }

    /**
     *
     * @param {array|object} names
     * @param {object|null} defaultValues
     * @returns {object}
     */
    const _getOnly = function (names, defaultValues) {
        const all = _all()

        const vars = {}
        if (names instanceof Array) {
            const applyDefaultValue = defaultValues === null
                ? () => null
                : name => defaultValues[name] ?? null
            names.forEach(name => {
                vars[name] = all[name] ?? applyDefaultValue(name)
            })
        }
        else {
            Object.keys(names).forEach(name => {
                vars[name] = all[name] ?? names[name]
            })
        }
        return vars
    }

    return {
        parsed,
        /**
         *
         * @param {string|object|array|null} name
         * @param {string|object|null} defaultValue
         * @returns {*|object|null}
         */
        get(name = null, defaultValue = null) {
            if (name === null) {
                return _getAll(defaultValue)
            }
            if (name instanceof Array) {
                return _getOnly(name, defaultValue)
            }
            if (typeof name === 'object' && name instanceof Object) {
                return _getOnly(name, null)
            }
            if (name in parsed) {
                return parsed[name] ?? defaultValue
            }
            if (!config.ignoreProcessEnv) {
                return process.env[name] ?? defaultValue
            }
            return defaultValue
        },
    }
}

function pack(config = {}) {
    const dotenvConfig = 'parsed' in config
        ? {
            parsed: config.parsed,
        }
        : load(
            'dotenvConfig' in config ? config.dotenvConfig : {},
            'useFlow' in config ? config.useFlow : true,
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
