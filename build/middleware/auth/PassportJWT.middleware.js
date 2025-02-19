"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helpers = require("../../helpers");
var _httpStatusCodes = require("http-status-codes");
var _passport = _interopRequireDefault(require("passport"));
var _passportJwt = require("passport-jwt");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class PassportJWTMiddleware {
  constructor() {
    _defineProperty(this, "JWTOptions", {
      secretOrKey: "secret",
      jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken()
    });
    _defineProperty(this, "JWTStrategy", new _passportJwt.Strategy(this.JWTOptions, this.verify));
  }
  verify(payload, done) {
    return _asyncToGenerator(function* () {
      try {
        done(null, {});
      } catch (PassportJWTException) {
        done("PassportJWTException", false);
      }
    })();
  }
  static use(req, res, next) {
    _passport.default.authenticate("jwt", {
      session: false
    }, (error, user, info) => {
      if (!user) {
        if (info.message === "No auth token") {
          return res.status(_httpStatusCodes.StatusCodes.UNAUTHORIZED).send(new _helpers.ApiErrorResponseHelper(_httpStatusCodes.StatusCodes.UNAUTHORIZED, (0, _httpStatusCodes.getReasonPhrase)(_httpStatusCodes.StatusCodes.UNAUTHORIZED), "Access token is missing! please check the request"));
        }
        if (info.name === "TokenExpiredError") {
          return res.status(_httpStatusCodes.StatusCodes.UNAUTHORIZED).send(new _helpers.ApiErrorResponseHelper(_httpStatusCodes.StatusCodes.UNAUTHORIZED, (0, _httpStatusCodes.getReasonPhrase)(_httpStatusCodes.StatusCodes.UNAUTHORIZED), "Access token is expired"));
        } else if (info.name === "JsonWebTokenError") {
          return res.status(_httpStatusCodes.StatusCodes.UNAUTHORIZED).send(new _helpers.ApiErrorResponseHelper(_httpStatusCodes.StatusCodes.UNAUTHORIZED, (0, _httpStatusCodes.getReasonPhrase)(_httpStatusCodes.StatusCodes.UNAUTHORIZED), "Invalid access token"));
        }
      }
    })(req, res, next);
  }
}
var _default = exports.default = PassportJWTMiddleware;
//# sourceMappingURL=PassportJWT.middleware.js.map