# dotenv-packed

[![NPM version](https://img.shields.io/npm/v/dotenv-packed.svg?style=flat-square)](https://www.npmjs.com/package/dotenv-packed)
[![Travis (.org)](https://img.shields.io/travis/com/linhntaim/dotenv-packed?style=flat-square)](https://app.travis-ci.com/github/linhntaim/dotenv-packed)
[![Coveralls github](https://img.shields.io/coveralls/github/linhntaim/dotenv-packed?style=flat-square)](https://coveralls.io/github/linhntaim/dotenv-packed)
[![NPM](https://img.shields.io/npm/l/dotenv-packed?style=flat-square)](https://github.com/linhntaim/dotenv-packed/blob/master/LICENSE)

All-in-one pack to load environment variables from .env file, then expand and convert them.
Powered by
[`dotenv`](https://www.npmjs.com/package/dotenv)/[`dotenv-flow`](https://www.npmjs.com/package/dotenv-flow),
[`dotenv-expand`](https://www.npmjs.com/package/dotenv-expand)
and [`dotenv-conversion`](https://www.npmjs.com/package/dotenv-conversion).

---

- [Installation](#installation)
- [Usage](#usage)
- [Preload](#preload)
- [Features](#features)
- [Documentation](#documentation)
    - [`pack`](#pack)
        - [Options](#options)
        - [Return Value](#return-value)

---

## Installation

```bash
npm install dotenv-packed --save
```

## Usage

- Standalone:

```javascript
// process.env
process.env.DEBUG = false
```

```javascript
const dotenvPacked = require('dotenv-packed')
/* or ES6 */
// import dotenvPacked from 'dotenv-packed'

const options = {
    parsed: { // define your variables
        VARIABLE_1: 'value 1',
        VARIABLE_2: '1e2',
        VARIABLE_3: 'boolean:$VARIABLE_2',
    },
}
const {parsed, get} = dotenvPacked.pack(options)

console.log(parsed) // (object) {VARIABLE_1: 'value_1', VARIABLE_2: 100, VARIABLE_3: true}  
console.log(process.env) // (object) { ... , DEBUG: 'false', VARIABLE_1: 'value 1', VARIABLE_2: '100', VARIABLE_3: 'true', ... }

console.log(parsed.DEBUG)               // (undefined) 'undefined'
console.log(parsed.VARIABLE_1)          // (string) 'value 1'
console.log(parsed.VARIABLE_2)          // (number) 100
console.log(parsed.VARIABLE_3)          // (boolean) true

console.log(get('DEBUG'))               // (string) 'false'
console.log(get('VARIABLE_1'))          // (string) 'value 1'
console.log(get('VARIABLE_2'))          // (number) 100
console.log(get('VARIABLE_3'))          // (boolean) true

console.log(process.env.DEBUG)          // (string) 'false'
console.log(process.env.VARIABLE_1)     // (string) 'value 1'
console.log(process.env.VARIABLE_2)     // (string) '100'
console.log(process.env.VARIABLE_3)     // (string) 'true'
```

- Use `dotenv` to load variables:

```dotenv
# .env file
VARIABLE_1="value 1"
VARIABLE_2=1
VARIABLE_3=boolean:$VARIABLE_2
```

```javascript
// process.env
process.env.DEBUG = false
```

```javascript
const dotenvPacked = require('dotenv-packed')
/* or ES6 */
// import dotenvPacked from 'dotenv-packed'

const options = {
    dotenvOptions: {
        // Options for `dotenv`.
        // See https://www.npmjs.com/package/dotenv#options.
    },
}
const {parsed, get} = dotenvPacked.pack(options)

console.log(parsed) // (object) {VARIABLE_1: 'value_1', VARIABLE_2: 100, VARIABLE_3: true}  
console.log(process.env) // (object) { ... , DEBUG: 'false', VARIABLE_1: 'value 1', VARIABLE_2: '100', VARIABLE_3: 'true', ... }

console.log(parsed.DEBUG)               // (undefined) 'undefined'
console.log(parsed.VARIABLE_1)          // (string) 'value 1'
console.log(parsed.VARIABLE_2)          // (number) 100
console.log(parsed.VARIABLE_3)          // (boolean) true

console.log(get('DEBUG'))               // (string) 'false'
console.log(get('VARIABLE_1'))          // (string) 'value 1'
console.log(get('VARIABLE_2'))          // (number) 100
console.log(get('VARIABLE_3'))          // (boolean) true

console.log(process.env.DEBUG)          // (string) 'false'
console.log(process.env.VARIABLE_1)     // (string) 'value 1'
console.log(process.env.VARIABLE_2)     // (string) '100'
console.log(process.env.VARIABLE_3)     // (string) 'true'
```

- Use `dotenv-flow` to load variables:

```dotenv
# .env.test file
VARIABLE_1="value 1"
VARIABLE_2=1
VARIABLE_3=boolean:$VARIABLE_2
```

```javascript
// process.env
process.env.DEBUG = false
```

```javascript
const dotenvPacked = require('dotenv-packed')
/* or ES6 */
// import dotenvPacked from 'dotenv-packed'

// load variables from .env.test file
process.env.NODE_ENV = 'test'

const options = {
    useFlow: true,
    dotenvOptions: {
        // Options for `dotenv-flow`.
        // See https://www.npmjs.com/package/dotenv-flow#configoptions--object.

        // load variables from .env.test file
        // (not use environment variable `NODE_ENV`)
        // node_env: 'test'
    },
}
const {parsed, get} = dotenvPacked.pack(options)

console.log(parsed) // (object) {VARIABLE_1: 'value_1', VARIABLE_2: 100, VARIABLE_3: true}  
console.log(process.env) // (object) { ... , DEBUG: 'false', VARIABLE_1: 'value 1', VARIABLE_2: '100', VARIABLE_3: 'true', ... }

console.log(parsed.DEBUG)               // (undefined) 'undefined'
console.log(parsed.VARIABLE_1)          // (string) 'value 1'
console.log(parsed.VARIABLE_2)          // (number) 100
console.log(parsed.VARIABLE_3)          // (boolean) true

console.log(get('DEBUG'))               // (string) 'false'
console.log(get('VARIABLE_1'))          // (string) 'value 1'
console.log(get('VARIABLE_2'))          // (number) 100
console.log(get('VARIABLE_3'))          // (boolean) true

console.log(process.env.DEBUG)          // (string) 'false'
console.log(process.env.VARIABLE_1)     // (string) 'value 1'
console.log(process.env.VARIABLE_2)     // (string) '100'
console.log(process.env.VARIABLE_3)     // (string) 'true'
```

## Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module)
to preload `dotenv-packed`. By doing this, you do not need to require and load 
`dotenv-packed` in your application code.
This is the preferred approach when using `import` instead of `require`.

By default, `dotenv` is used to load .env file:

```bash
$ node -r dotenv-packed/config your_script.js
```

***Note:* See `dotenv`'s [Preload](https://www.npmjs.com/package/dotenv#preload) 
for more supported command line arguments.

You can have `dotenv-flow` load .env file based on the environment variable `NODE_ENV` 
by using the command line argument `--use-flow` 
or setting environment variable `DOTENV_PACKED_USE_FLOW`:

```bash
$ NODE_ENV=<value> node -r dotenv-packed/config your_script.js --use-flow
# or:
$ NODE_ENV=<value> DOTENV_PACKED_USE_FLOW=true node -r dotenv-packed/config your_script.js
```

Additionally, you can use the command line argument `--node-env` 
instead of `NODE_ENV` as follows:

```bash
$ node -r dotenv-packed/config your_script.js --use-flow --node-env <value>
# or:
$ node -r dotenv-packed/config your_script.js --use-flow --node-env=<value>
```

## Features

- [`dotenv`](https://www.npmjs.com/package/dotenv)
- [`dotenv-flow`](https://www.npmjs.com/package/dotenv-flow)
- [`dotenv-expand`](https://www.npmjs.com/package/dotenv-expand)
- [`dotenv-conversion`](https://www.npmjs.com/package/dotenv-conversion)

## Documentation

`dotenv-packed` exposes only 1 function:

- `pack`

### `pack`

`pack` function will load environment variables from .env file and assign them to `process.env`,
then expand and convert them.

```javascript
const dotenvPacked = require('dotenv-packed')
/* or ES6 */
// import dotenvPacked from 'dotenv-packed'

const options = {
    // ...
}
const env = dotenvPacked.pack(options)
```

#### Options

##### `useFlow`

*Type:* `boolean`. *Default:* `false`.

If this option is set to `false`, `dotenv` will be the loader for .env file.
Otherwise, `dotenv-flow` will.

##### `dotenvOptions`

*Type:* `object`. *Default:* `{}`.

If `useFlow` is `false`, this option will contain `dotenv`'s [options](https://www.npmjs.com/package/dotenv#options).
Otherwise, it will contain `dotenv-flow`'s [options](https://www.npmjs.com/package/dotenv-flow#configoptions--object).

##### `dotenvExpandOptions`

*Type:* `object`. *Default:* `{}`.

This option contains `dotenv-expand`'s [options](https://www.npmjs.com/package/dotenv-expand#options).

##### `dotenvConversionOptions`

*Type:* `object`. *Default:* `{}`.

This option contains `dotenv-conversion`'s [options](https://www.npmjs.com/package/dotenv-conversion#options).

##### `ignoreProcessEnv`

Type: `boolean`.

If this option is set to `false`, the environment variables' values
after expanding and converting will be written back to `process.env`.
If this option is set to `true`, they won't.

***Note:* This option will override the option (with the same name and same function)
in both `dotenv-expand`'s options and `dotenv-conversion`'s options.
Don't set value for this option when you prefer to
use the option in `dotenv-expand`'s options or `dotenv-conversion`'s options.

#### Return Value

The return value of `pack` function has two properties: `parsed` and `get`.

##### Property `parsed`

`parsed` is an object of environment variables which have been parsed
(loaded, then expanded and converted) from .env file.

```javascript
const env = dotenvPacked.pack()

console.log(env.parsed) // (object) {VARIABLE_1: 'value 1', VARIABLE_2: null}
```

##### Property `get`

`get` is a helper function to get values of environment variables
which have been parsed from .env file or in `process.env`.

- Get value of a variable:

```javascript
const env = dotenvPacked.pack()

console.log(env.get('VARIABLE_1')) // (string) 'value 1'
console.log(env.get('VARIABLE_2')) // (object) null
```

***Note:* If the variable is not set or set to null, the null value will be returned.

- Get value of a variable with its default value:

```javascript
const env = dotenvPacked.pack()

console.log(env.get('VARIABLE_2', 'default value 2')) // (string) 'default value 2'
```

***Note:* The default value will be returned if the variable is not set or set to null.

- Get values of a set of variables:

```javascript
const env = dotenvPacked.pack()

console.log(env.get(['VARIABLE_1', 'VARIABLE_2'])) // (object) {VARIABLE_1: 'value 1', VARIABLE_2: null}
```

***Note:* If any of variables is not set or set to null, the null value will be represented as its value.

- Get values of a set of variables with their default values:

```javascript
const env = dotenvPacked.pack()

// This:
console.log(
    env.get(
        // set of variables
        ['VARIABLE_1', 'VARIABLE_2'],
        // default values
        {VARIABLE_2: 'default value 2'}
    )
) // (object) {VARIABLE_1: 'value 1', VARIABLE_2: 'default value 2'}

// Or this:
console.log(
    env.get({
        // set of variables + default values
        VARIABLE_1: 'default value 1',
        VARIABLE_2: 'default value 2',
    })
) // (object) {VARIABLE_1: 'value 1', VARIABLE_2: 'default value 2'}
```

***Note:* If any of variables is not set or set to null, the default value will be used as its value.
