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

```smartyconfig
# .env file

VARIABLE_1=value_1
VARIABLE_2=yes
```

```javascript
// javascript

import {install, env, getenv} from 'dotenv-packed'

// ** Basic: parsing, expanding, conversing variables

const {parsed} = install()

console.log(parsed) // output: (object) { ... , VARIABLE_1: 'value_1', VARIABLE_2: true, ... }  
console.log(process.env) // output: (object) { ... , DEBUG: 'false', VARIABLE_1: 'value_1', VARIABLE_2: 'true', ... }
console.log(env()) // output: (object) { ... , DEBUG: false, VARIABLE_1: 'value_1', VARIABLE_2: true, ... } 

console.log(process.env.DEBUG) // output: (string) 'false'
console.log(process.env.VARIABLE_1) // output: (string) 'value_1'
console.log(process.env.VARIABLE_2) // output: (string) 'true'

console.log(env().DEBUG) // output: (boolean) false
console.log(env().VARIABLE_1) // output: (string) 'value_1'
console.log(env().VARIABLE_2) // output: (boolean) true

console.log(getenv('DEBUG')) // output: (boolean) 'false'
console.log(getenv('VARIABLE_1')) // output: (string) 'value_1'
console.log(getenv('VARIABLE_2')) // output: (boolean) true

// ** With extra configuration of `dotenv-conversion`

const {parsed} = install({
    dotenvConversionConfig: {
        specs: {
            VARIABLE_1(value) {
                return value.toUpperCase()
            },
        },
    },
})

console.log(parsed) // output: (object) { ... , VARIABLE_1: 'VALUE_1', VARIABLE_2: true, ... }
console.log(process.env) // output: (object) { ... , DEBUG: 'false', VARIABLE_1: 'VALUE_1', VARIABLE_2: 'true', ... }
console.log(env()) // output: (object) { ... , DEBUG: false, VARIABLE_1: 'VALUE_1', VARIABLE_2: true, ... }

console.log(process.env.DEBUG) // output: (string) 'false'
console.log(process.env.VARIABLE_1) // output: (string) 'value_1'
console.log(process.env.VARIABLE_2) // output: (string) 'true'

console.log(env().DEBUG) // output: (boolean) false
console.log(env().VARIABLE_1) // output: (string) 'VALUE_1'
console.log(env().VARIABLE_2) // output: (boolean) true

console.log(getenv('DEBUG')) // output: (boolean) false
console.log(getenv('VARIABLE_1')) // output: (string) 'VALUE_1'
console.log(getenv('VARIABLE_2')) // output: (boolean) true

```

## Features

See:

- [**`dotenv`**](https://github.com/motdotla/dotenv)
- [**`dotenv-expand`**](https://github.com/motdotla/dotenv-expand)
- [**`dotenv-conversion`**](https://github.com/motdotla/dotenv-conversion)