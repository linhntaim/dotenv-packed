"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _dotenvExpand = _interopRequireDefault(require("dotenv-expand"));
var _dotenvFlow = _interopRequireDefault(require("dotenv-flow"));
var _dotenvConversion = _interopRequireDefault(require("dotenv-conversion"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function removeParsed(config) {
  if ('parsed' in config) {
    delete config.parsed;
  }
  return config;
}
function load(flow, dotenvFlowConfig, dotenvConfig) {
  var result = flow ? _dotenvFlow["default"].config(dotenvFlowConfig) : _dotenv["default"].config(dotenvConfig);
  if ('error' in result) {
    throw result.error;
  }
  return result;
}
function createResult(parsed, config) {
  return {
    parsed: parsed,
    /**
     *
     * @param {string} name
     * @param {*|null} defaultValue
     * @returns {*|null}
     */
    get: function get(name) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (name in parsed.env) {
        return parsed[name];
      }
      if (!config.ignoreProcessEnv && name in process.env) {
        return process.env[name];
      }
      return defaultValue;
    }
  };
}
function pack() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var dotenvConfig = 'parsed' in config ? {
    parsed: config.parsed
  } : load('flow' in config ? config.flow : true, 'dotenvFlowConfig' in config ? config.dotenvFlowConfig : {}, 'dotenvConfig' in config ? config.dotenvConfig : {});
  var dotenvExpandConfig = 'dotenvExpandConfig' in config ? removeParsed(config.dotenvExpandConfig) : {};
  var dotenvConversionConfig = 'dotenvConversionConfig' in config ? removeParsed(config.dotenvConversionConfig) : {};
  if (!('ignoreProcessEnv' in config)) {
    config.ignoreProcessEnv = false;
  }
  dotenvExpandConfig.ignoreProcessEnv = config.ignoreProcessEnv;
  dotenvConversionConfig.ignoreProcessEnv = config.ignoreProcessEnv;
  return createResult(_dotenvConversion["default"].convert(Object.assign({}, _dotenvExpand["default"].expand(Object.assign({}, dotenvConfig, dotenvExpandConfig)), dotenvConversionConfig)).parsed, {
    ignoreProcessEnv: config.ignoreProcessEnv
  });
}
var _default = exports["default"] = {
  pack: pack
};
module.exports = exports.default;