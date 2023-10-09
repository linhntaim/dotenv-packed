"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env;
  var nullOrEmpty = function nullOrEmpty(name) {
    return !(name in env) || env[name] === '';
  };
  var options = {};
  options.useFlow = 'DOTENV_PACKED_USE_FLOW' in env && function (useFlow) {
    return !(['false', 'no', 'not', 'none'].includes(useFlow) || /^((0+(\..*)?)|(\..*))$/.test(useFlow));
  }(env.DOTENV_PACKED_USE_FLOW.toLowerCase());
  if (options.useFlow) {
    var dotenvFlowOptions = {};
    if (!nullOrEmpty('NODE_ENV')) {
      dotenvFlowOptions.node_env = env.NODE_ENV;
    }
    options.dotenvOptions = dotenvFlowOptions;
  } else {
    var dotenvOptions = {};
    if (!nullOrEmpty('DOTENV_CONFIG_ENCODING')) {
      dotenvOptions.encoding = env.DOTENV_CONFIG_ENCODING;
    }
    if (!nullOrEmpty('DOTENV_CONFIG_PATH')) {
      dotenvOptions.path = env.DOTENV_CONFIG_PATH;
    }
    if (!nullOrEmpty('DOTENV_CONFIG_DEBUG')) {
      dotenvOptions.debug = env.DOTENV_CONFIG_DEBUG;
    }
    if (!nullOrEmpty('DOTENV_CONFIG_OVERRIDE')) {
      dotenvOptions.override = env.DOTENV_CONFIG_OVERRIDE;
    }
    if (!nullOrEmpty('DOTENV_CONFIG_DOTENV_KEY')) {
      dotenvOptions.DOTENV_KEY = env.DOTENV_CONFIG_DOTENV_KEY;
    }
    options.dotenvOptions = dotenvOptions;
  }
  return options;
}
module.exports = exports.default;