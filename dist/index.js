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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function removeParsed(config) {
  if ('parsed' in config) {
    delete config.parsed;
  }
  return config;
}
function attachDotenvFlowDefaultConfig(config) {
  config.silent = true;
  return config;
}
function attachDotenvDefaultConfig(config) {
  return config;
}
function load(config, useFlow) {
  var result = useFlow ? _dotenvFlow["default"].config(attachDotenvFlowDefaultConfig(config)) : _dotenv["default"].config(attachDotenvDefaultConfig(config));
  if ('error' in result) {
    throw 'Cannot load .env file';
  }
  return result;
}
function createResult(parsed, config) {
  /**
   * @var {object}
   */
  var _memAll;
  var _all = function _all() {
    var _memAll2;
    return _objectSpread({}, (_memAll2 = _memAll) !== null && _memAll2 !== void 0 ? _memAll2 : _memAll = Object.assign({}, process.env, parsed));
  };

  /**
   *
   * @param {object|null} defaultValues
   * @returns {object}
   */
  var _getAll = function _getAll(defaultValues) {
    var all = _all();
    if (defaultValues !== null) {
      for (var _i = 0, _Object$entries = Object.entries(defaultValues); _i < _Object$entries.length; _i++) {
        var _all$name;
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          name = _Object$entries$_i[0],
          defaultValue = _Object$entries$_i[1];
        all[name] = (_all$name = all[name]) !== null && _all$name !== void 0 ? _all$name : defaultValue;
      }
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
    var all = _all();
    var vars = {};
    if (names instanceof Array) {
      var applyDefaultValue = defaultValues === null ? function () {
        return null;
      } : function (name) {
        var _defaultValues$name;
        return (_defaultValues$name = defaultValues[name]) !== null && _defaultValues$name !== void 0 ? _defaultValues$name : null;
      };
      names.forEach(function (name) {
        var _all$name2;
        vars[name] = (_all$name2 = all[name]) !== null && _all$name2 !== void 0 ? _all$name2 : applyDefaultValue(name);
      });
    } else {
      Object.keys(names).forEach(function (name) {
        var _all$name3;
        vars[name] = (_all$name3 = all[name]) !== null && _all$name3 !== void 0 ? _all$name3 : names[name];
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
      if (_typeof(name) === 'object' && name instanceof Object) {
        return _getOnly(name, null);
      }
      if (name in parsed) {
        var _parsed$name;
        return (_parsed$name = parsed[name]) !== null && _parsed$name !== void 0 ? _parsed$name : defaultValue;
      }
      if (!config.ignoreProcessEnv) {
        var _process$env$name;
        return (_process$env$name = process.env[name]) !== null && _process$env$name !== void 0 ? _process$env$name : defaultValue;
      }
      return defaultValue;
    }
  };
}
function pack() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var dotenvConfig = 'parsed' in config ? {
    parsed: config.parsed
  } : load('dotenvConfig' in config ? config.dotenvConfig : {}, 'useFlow' in config ? config.useFlow : true);
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