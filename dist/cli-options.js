"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _cliOptions = _interopRequireDefault(require("dotenv/lib/cli-options"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _default() {
  var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
  var options = {};
  options.useFlow = argv.includes('--use-flow');
  if (options.useFlow) {
    var dotenvFlowOptions = {};
    var nodeEnvArg = '--node-env';
    argv.some(function (arg, index) {
      if (arg === nodeEnvArg) {
        dotenvFlowOptions.node_env = argv[index + 1];
        return true;
      }
      if (arg.startsWith("".concat(nodeEnvArg, "="))) {
        dotenvFlowOptions.node_env = arg.substring(nodeEnvArg.length + 1);
        return true;
      }
      return false;
    });
    options.dotenvOptions = dotenvFlowOptions;
  } else {
    options.dotenvOptions = Object.assign({}, (0, _cliOptions["default"])(argv));
  }
  return options;
}
module.exports = exports.default;