import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import dotenvConversion from 'dotenv-conversion'

export const install = ({dotenvConversionConfig = {}} = {}) => {
    return dotenvConversion.make(dotenvExpand(dotenv.config()), dotenvConversionConfig)
}
export const env = () => {
    return dotenvConversion.env
}
export const getenv = (name = null) => {
    return dotenvConversion.getenv(name)
}