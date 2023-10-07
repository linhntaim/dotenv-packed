"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEnv = exports.getEnv = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _dotenvExpand = _interopRequireDefault(require("dotenv-expand"));
var _dotenvConversion = _interopRequireDefault(require("dotenv-conversion"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var parseEnv = exports.parseEnv = function parseEnv() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$dotenvConfigOpti = _ref.dotenvConfigOptions,
    dotenvConfigOptions = _ref$dotenvConfigOpti === void 0 ? {} : _ref$dotenvConfigOpti,
    _ref$dotenvConversion = _ref.dotenvConversionConfigOptions,
    dotenvConversionConfigOptions = _ref$dotenvConversion === void 0 ? {} : _ref$dotenvConversion;
  return _dotenvConversion["default"].make(_dotenvExpand["default"].expand(_dotenv["default"].config(dotenvConfigOptions)), dotenvConversionConfigOptions);
};
var getEnv = exports.getEnv = function getEnv() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return _dotenvConversion["default"].getenv(name, def);
};