import dotenv from 'dotenv'
import dotenvConversion from 'dotenv-conversion'
import dotenvExpand from 'dotenv-expand'
import dotenvFlow from 'dotenv-flow'

function load(useFlow, options) {
    if (useFlow) {
        // dotenv-flow option
        options.silent = true
    }
    const result = useFlow
        ? dotenvFlow.config(options)
        : dotenv.config(options)
    if ('error' in result) {
        throw 'Cannot load .env file'
    }
    return result
}

function createResult(parsed, options) {
    const _hasOrDefault = (obj, name, defaultValue) => name in obj ? obj[name] : defaultValue

    /**
     * @var {object}
     */
    let _all

    const _memAll = () => _all ?? (_all = Object.assign({}, process.env, parsed))

    /**
     *
     * @param {object|null} defaultValues
     * @returns {object}
     */
    const _getAll = defaultValues => {
        // need to clone all
        const all = Object.assign({}, _memAll())
        if (defaultValues !== null) {
            Object.keys(defaultValues).forEach(name => {
                all[name] = _hasOrDefault(all, name, defaultValues[name])
            })
        }
        return all
    }

    /**
     *
     * @param {array|object} names
     * @param {object|null} defaultValues
     * @returns {object}
     */
    const _getOnly = (names, defaultValues) => {
        const all = _memAll()

        const vars = {}
        if (names instanceof Array) {
            const applyDefaultValue = defaultValues === null
                ? () => null
                : name => _hasOrDefault(defaultValues, name, null)
            names.forEach(name => {
                vars[name] = _hasOrDefault(all, name, applyDefaultValue(name))
            })
        }
        else {
            Object.keys(names).forEach(name => {
                vars[name] = _hasOrDefault(all, name, names[name])
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
            if (name instanceof Object && !(name instanceof String)) {
                return _getOnly(name, null)
            }
            return _hasOrDefault(
                parsed,
                name,
                !options.ignoreProcessEnv
                    ? _hasOrDefault(process.env, name, defaultValue)
                    : defaultValue,
            )
        },
    }
}

function pack(options = {}) {
    const dotenvConfig = 'parsed' in options
        ? {
            parsed: options.parsed,
        }
        : load(
            'useFlow' in options ? options.useFlow : true,
            'dotenvOptions' in options ? options.dotenvOptions : {},
        )
    const removeParsed = c => {
        'parsed' in c && delete c.parsed
        return c
    }
    const dotenvExpandOptions = 'dotenvExpandOptions' in options ? removeParsed(options.dotenvExpandOptions) : {}
    const dotenvConversionOptions = 'dotenvConversionOptions' in options ? removeParsed(options.dotenvConversionOptions) : {}
    if ('ignoreProcessEnv' in options) {
        dotenvExpandOptions.ignoreProcessEnv = options.ignoreProcessEnv
        dotenvConversionOptions.ignoreProcessEnv = options.ignoreProcessEnv
    }

    return createResult(
        dotenvConversion.convert(
            Object.assign(
                {},
                dotenvExpand.expand(
                    Object.assign(
                        {},
                        dotenvConfig,
                        dotenvExpandOptions,
                    ),
                ),
                dotenvConversionOptions,
            ),
        ).parsed,
        {
            ignoreProcessEnv: options.ignoreProcessEnv,
        },
    )
}

export default {pack}
