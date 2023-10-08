(function () {
    const dotenvPacked = require('./dist').pack

    return global.dotenvPacked = dotenvPacked(
        Object.assign(
            {},
            require('./dist/env-options')(),
            require('./dist/cli-options')(),
        ),
    )
})()
