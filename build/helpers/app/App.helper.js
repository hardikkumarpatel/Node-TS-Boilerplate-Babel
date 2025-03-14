"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _httpStatusCodes = _interopRequireWildcard(require("http-status-codes"));
var _ = require("./..");
var _config = require("../../config");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class AppHelper {
  static serverErrorListening(error) {
    return _asyncToGenerator(function* () {
      if (error.syscall !== "listen") {
        throw error;
      }
      switch (error.code) {
        case "EACCES":
          _.Log.info("Requires privileges");
          return process.exit(1);
        case "EADDRINUSE":
          _.Log.error("".concat(_config.Config.get(_config.IConfigKey.PORT), " is already in use"));
          return process.exit(1);
        default:
          throw error;
      }
    })();
  }
  static listening(server) {
    return _asyncToGenerator(function* () {
      var address = server.address();
      _.Log.info("Express engine is running on ".concat(address.port, " \uD83D\uDE80"));
    })();
  }
  static signalListening(app) {
    var http = app.get("HttpServer");
    process.on("SIGINT", /*#__PURE__*/_asyncToGenerator(function* () {
      try {
        http.close();
      } catch (SIGINTError) {
        if (SIGINTError instanceof Error) {
          _.Log.error("Error occurred during shutdown server", SIGINTError);
        }
      } finally {
        var _GraphQL, _IO, _MongoDB;
        (_GraphQL = global.GraphQL) === null || _GraphQL === void 0 || _GraphQL.stop();
        (_IO = global.IO) === null || _IO === void 0 || _IO.close();
        (_MongoDB = global.MongoDB) === null || _MongoDB === void 0 || _MongoDB.disconnect();
        _.Log.info("Express engine and all running instance are shutdown successfully \uD83C\uDF31");
        process.exit(1);
      }
    })).on("SIGTERM", () => {
      if (http) {
        http.close();
      }
    }).on("SIGHUP", () => {
      process.kill(process.pid, "SIGTERM");
    }).on("uncaughtException", UncaughtError => {
      var _GraphQL2, _IO2, _MongoDB2;
      _.Log.error("Uncaught Exception thrown", UncaughtError);
      http.close();
      (_GraphQL2 = global.GraphQL) === null || _GraphQL2 === void 0 || _GraphQL2.stop();
      (_IO2 = global.IO) === null || _IO2 === void 0 || _IO2.close();
      (_MongoDB2 = global.MongoDB) === null || _MongoDB2 === void 0 || _MongoDB2.disconnect();
      process.exit(1);
    }).on("unhandledRejection", UncaughtReason => {
      _.Log.error("Unhandled Rejection thrown", UncaughtReason);
      process.exit(1);
    });
  }
  static validate() {
    return _asyncToGenerator(function* () {
      if (!_config.Config.get(_config.IConfigKey.PORT) || !_config.Config.get(_config.IConfigKey.NODE_ENV)) {
        _.Log.error("The node env or PORT mapping is missing! Please check the .env file for the correct mapping.");
        _.Log.error("x-----------------------------------------------x");
        _.Log.error("x==================== ERROR ====================x");
        _.Log.error("x-----------------------------------------------x");
        return false;
      }
      return true;
    })();
  }
}
_defineProperty(AppHelper, "useAppHealthRoute", (req, res) => {
  var {
    platform,
    pid,
    uptime,
    env
  } = process;
  return res.status(_httpStatusCodes.default.OK).json(new _.ApiResponseHelper(_httpStatusCodes.default.OK, "Welcome to backend! made in NODE with ❤️", {
    platform,
    pid,
    uptime: uptime(),
    env: env.NODE_ENV,
    cwd: process.cwd()
  }));
});
_defineProperty(AppHelper, "useAppNotFoundRoute", () => {
  throw new _.ApiErrorResponseHelper(_httpStatusCodes.default.NOT_FOUND, (0, _httpStatusCodes.getReasonPhrase)(_httpStatusCodes.default.NOT_FOUND), "Request resource not found");
});
var _default = exports.default = AppHelper;
//# sourceMappingURL=App.helper.js.map