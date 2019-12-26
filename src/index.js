import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import dotenvConversion from 'dotenv-conversion'

export const parseEnv = ({dotenvConfigOptions = {}, dotenvConversionConfigOptions = {}} = {}) => {
    return dotenvConversion.make(dotenvExpand(dotenv.config(dotenvConfigOptions)), dotenvConversionConfigOptions)
}
export const getEnv = (name = null, def = null) => {
    return dotenvConversion.getenv(name, def)
}