"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _dotenvConversion = _interopRequireDefault(require("dotenv-conversion"));
var _dotenvExpand = _interopRequireDefault(require("dotenv-expand"));
var _dotenvFlow = _interopRequireDefault(require("dotenv-flow"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function load(useFlow, options) {
  if (useFlow) {
    // dotenv-flow option
    options.silent = true;
  }
  var result = useFlow ? _dotenvFlow["default"].config(options) : _dotenv["default"].config(options);
  if ('error' in result) {
    throw 'Cannot load .env file';
  }
  return result;
}
function createResult(parsed, options) {
  var _hasOrDefault = function _hasOrDefault(obj, name, defaultValue) {
    return name in obj ? obj[name] : defaultValue;
  };

  /**
   * @var {object}
   */
  var _all;
  var _memAll = function _memAll() {
    var _all2;
    return (_all2 = _all) !== null && _all2 !== void 0 ? _all2 : _all = Object.assign({}, process.env, parsed);
  };

  /**
   *
   * @param {object|null} defaultValues
   * @returns {object}
   */
  var _getAll = function _getAll(defaultValues) {
    // need to clone all
    var all = Object.assign({}, _memAll());
    if (defaultValues !== null) {
      Object.keys(defaultValues).forEach(function (name) {
        all[name] = _hasOrDefault(all, name, defaultValues[name]);
      });
    }
    return all;
  };

  /**
   *
   * @param {array|object} names
   * @param {object|null} defaultValues
   * @returns {object}
   */
  var _getOnly = function _getOnly(names, defaultValues) {
    var all = _memAll();
    var vars = {};
    if (names instanceof Array) {
      var applyDefaultValue = defaultValues === null ? function () {
        return null;
      } : function (name) {
        return _hasOrDefault(defaultValues, name, null);
      };
      names.forEach(function (name) {
        vars[name] = _hasOrDefault(all, name, applyDefaultValue(name));
      });
    } else {
      Object.keys(names).forEach(function (name) {
        vars[name] = _hasOrDefault(all, name, names[name]);
      });
    }
    return vars;
  };
  return {
    parsed: parsed,
    /**
     *
     * @param {string|object|array|null} name
     * @param {string|object|null} defaultValue
     * @returns {*|object|null}
     */
    get: function get() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (name === null) {
        return _getAll(defaultValue);
      }
      if (name instanceof Array) {
        return _getOnly(name, defaultValue);
      }
      if (name instanceof Object && !(name instanceof String)) {
        return _getOnly(name, null);
      }
      return _hasOrDefault(parsed, name, !options.ignoreProcessEnv ? _hasOrDefault(process.env, name, defaultValue) : defaultValue);
    }
  };
}
function pack() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var dotenvConfig = 'parsed' in options ? {
    parsed: options.parsed
  } : load('useFlow' in options ? options.useFlow : true, 'dotenvOptions' in options ? options.dotenvOptions : {});
  var removeParsed = function removeParsed(c) {
    'parsed' in c && delete c.parsed;
    return c;
  };
  var dotenvExpandOptions = 'dotenvExpandOptions' in options ? removeParsed(options.dotenvExpandOptions) : {};
  var dotenvConversionOptions = 'dotenvConversionOptions' in options ? removeParsed(options.dotenvConversionOptions) : {};
  if ('ignoreProcessEnv' in options) {
    dotenvExpandOptions.ignoreProcessEnv = options.ignoreProcessEnv;
    dotenvConversionOptions.ignoreProcessEnv = options.ignoreProcessEnv;
  }
  return createResult(_dotenvConversion["default"].convert(Object.assign({}, _dotenvExpand["default"].expand(Object.assign({}, dotenvConfig, dotenvExpandOptions)), dotenvConversionOptions)).parsed, {
    ignoreProcessEnv: options.ignoreProcessEnv
  });
}
var _default = exports["default"] = {
  pack: pack
};
module.exports = exports.default;