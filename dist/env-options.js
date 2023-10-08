"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _envOptions = _interopRequireDefault(require("dotenv/lib/env-options"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env;
  var options = {};
  options.useFlow = 'DOTENV_PACKED_USE_FLOW' in env && function (useFlow) {
    return !['false', 'no', 'not', 'none'].includes(useFlow) || /^\.?0/.test(useFlow);
  }(env.DOTENV_PACKED_USE_FLOW.toLowerCase());
  if (options.useFlow) {
    var dotenvFlowOptions = {};
    if ('NODE_ENV' in env) {
      dotenvFlowOptions.node_env = env.NODE_ENV;
    }
    options.dotenvOptions = dotenvFlowOptions;
  } else {
    options.dotenvOptions = Object.assign({}, _envOptions["default"]);
  }
  return options;
}
module.exports = exports.default;