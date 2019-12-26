# dotenv-packed

[![NPM version](https://img.shields.io/npm/v/dotenv-packed.svg?style=flat-square)](https://www.npmjs.com/package/dotenv-packed)
[![Travis (.org)](https://img.shields.io/travis/linhntaim/dotenv-packed?style=flat-square)](https://travis-ci.org/linhntaim/dotenv-packed)
[![Coveralls github](https://img.shields.io/coveralls/github/linhntaim/dotenv-packed?style=flat-square)](https://coveralls.io/github/linhntaim/dotenv-packed)
[![NPM](https://img.shields.io/npm/l/dotenv-packed?style=flat-square)](https://github.com/linhntaim/dotenv-packed/blob/master/LICENSE)

Pack **`dotenv`** and some of its extensions (**`dotenv-expand`** and **`dotenv-conversion`**) into one.

## Install

```shell script
npm install dotenv-packed
```

## Usage

```shell script
# process.env

DEBUG=false
```

```shell script
# .env file

VARIABLE_1=value_1
VARIABLE_2=yes
```

```javascript
// .js file

import {parseEnv, getEnv} from 'dotenv-packed'

// ** Basic
const {parsed} = parseEnv() // parse, expand, convert variables
const env = getEnv()

console.log(parsed) // (object) { ... , VARIABLE_1: 'value_1', VARIABLE_2: true, ... }  
console.log(process.env) // (object) { ... , DEBUG: 'false', VARIABLE_1: 'value_1', VARIABLE_2: 'true', ... }
console.log(env) // (object) { ... , DEBUG: false, VARIABLE_1: 'value_1', VARIABLE_2: true, ... } 

console.log(process.env.DEBUG) // (string) 'false'
console.log(process.env.VARIABLE_1) // (string) 'value_1'
console.log(process.env.VARIABLE_2) // (string) 'true'
console.log(process.env.NOT_SET) // undefined

console.log(env.DEBUG) // (boolean) false
console.log(env.VARIABLE_1) // (string) 'value_1'
console.log(env.VARIABLE_2) // (boolean) true
console.log(env.NOT_SET) // undefined

console.log(getEnv('DEBUG')) // (boolean) 'false'
console.log(getEnv('VARIABLE_1')) // (string) 'value_1'
console.log(getEnv('VARIABLE_2')) // (boolean) true
console.log(getEnv('NOT_SET')) // null
console.log(getEnv('NOT_SET', 'default_value')) // (string) 'default_value'

// ** With extra configuration options of `dotenv` or `dotenv-conversion`
const {parsed} = parseEnv({
    dotenvConfigOptions: { ... },
    dotenvConversionConfigOptions: {
        specs: {
            VARIABLE_1(value) {
                return value.toUpperCase()
            },
        },
    },
})
const env = getEnv()

console.log(parsed) // (object) { ... , VARIABLE_1: 'VALUE_1', VARIABLE_2: true, ... }
console.log(process.env) // (object) { ... , DEBUG: 'false', VARIABLE_1: 'VALUE_1', VARIABLE_2: 'true', ... }
console.log(env) // (object) { ... , DEBUG: false, VARIABLE_1: 'VALUE_1', VARIABLE_2: true, ... }

console.log(process.env.DEBUG) // (string) 'false'
console.log(process.env.VARIABLE_1) // (string) 'value_1'
console.log(process.env.VARIABLE_2) // (string) 'true'
console.log(process.env.NOT_SET) // undefined

console.log(env.DEBUG) // (boolean) false
console.log(env.VARIABLE_1) // (string) 'VALUE_1'
console.log(env.VARIABLE_2) // (boolean) true
console.log(env.NOT_SET) // undefined

console.log(getEnv('DEBUG')) // (boolean) false
console.log(getEnv('VARIABLE_1')) // (string) 'VALUE_1'
console.log(getEnv('VARIABLE_2')) // (boolean) true
console.log(getEnv('NOT_SET')) // null
console.log(getEnv('NOT_SET', 'default_value')) // (string) 'default_value'

```

## Features

See configuration options and features at their own repositories:

- [**`dotenv`**](https://github.com/motdotla/dotenv)
- [**`dotenv-expand`**](https://github.com/motdotla/dotenv-expand)
- [**`dotenv-conversion`**](https://github.com/linhntaim/dotenv-conversion)