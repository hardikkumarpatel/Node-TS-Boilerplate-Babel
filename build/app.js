"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("dotenv/config");
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _nodeHttp = _interopRequireDefault(require("node:http"));
var _nodePath = _interopRequireDefault(require("node:path"));
var _passport = _interopRequireDefault(require("passport"));
var _helpers = require("./helpers");
var _swagger = require("./swagger");
var _config2 = require("./config");
var _middleware = require("./middleware");
var _Graphql = _interopRequireDefault(require("./api/graphql/Graphql.server"));
var _routes = _interopRequireDefault(require("./routes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
class ExpressEngine {
  static run() {
    return _asyncToGenerator(function* () {
      if (!(yield _helpers.AppHelper.validate())) process.exit(1);
      yield ExpressEngine.startEngine().then(_helpers.AppHelper.signalListening).catch(_helpers.Log.error);
    })();
  }
  static startEngine() {
    return _asyncToGenerator(function* () {
      ExpressEngine.App = (0, _express.default)();
      ExpressEngine.HttpServer = _nodeHttp.default.createServer(ExpressEngine.App);
      ExpressEngine.App.set("HttpServer", ExpressEngine.HttpServer);
      ExpressEngine.App.set("port", _config2.Config.get(_config2.IConfigKey.PORT));
      ExpressEngine.HttpServer.on("error", _helpers.AppHelper.serverErrorListening);
      ExpressEngine.HttpServer.on("close", _helpers.Log.info);
      ExpressEngine.HttpServer.on("listening", /*#__PURE__*/_asyncToGenerator(function* () {
        return yield _helpers.AppHelper.listening(ExpressEngine.HttpServer).then(ExpressEngine.initialize);
      }));
      ExpressEngine.HttpServer.listen(_config2.Config.get(_config2.IConfigKey.PORT));
      return ExpressEngine.App;
    })();
  }
  static initialize() {
    return _asyncToGenerator(function* () {
      // await MongoDBConnection.connect();
      yield ExpressEngine.initializeMiddleware();
      yield ExpressEngine.setupRequestMiddleware();
      yield ExpressEngine.initializeRoutes();
      yield ExpressEngine.initializeSwaggerDocs();
      yield ExpressEngine.initializeSocket();
      yield ExpressEngine.initializeGraphQLServer();
      yield ExpressEngine.initializeGlobalMiddleware();
    })();
  }
  static initializeMiddleware() {
    var _this = this;
    return _asyncToGenerator(function* () {
      _this.App.use(_express.default.urlencoded({
        limit: "6kb",
        extended: true
      }));
      _this.App.use(_express.default.json({
        limit: "6kb"
      }));
      _this.App.use(new _middleware.MorganLogMiddleware().success);
      _this.App.use(new _middleware.MorganLogMiddleware().error);
      _this.App.use("/upload", _express.default.static(_nodePath.default.resolve("src", "upload")));
      _this.App.use((0, _cors.default)({
        origin: "*",
        methods: ["GET", "HEAD", "PUT", "OPTIONS", "PATCH", "POST", "DELETE"]
      }));
      _this.App.use((0, _helmet.default)({
        contentSecurityPolicy: false
      }));
      _this.App.use((0, _cookieParser.default)());
    })();
  }
  static setupRequestMiddleware() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      _this2.App.use((req, res, next) => {
        var _req$entity;
        (_req$entity = req.entity) !== null && _req$entity !== void 0 ? _req$entity : req.entity = {};
        next();
      });
    })();
  }
  static initializeRoutes() {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      _this3.App.use(_passport.default.initialize());
      _passport.default.use(new _middleware.PassportJWTMiddleware().JWTStrategy);
      _this3.App.use("/health", _helpers.AppHelper.useAppHealthRoute);
      _this3.App.use(_routes.default);
    })();
  }
  static initializeSwaggerDocs() {
    return _asyncToGenerator(function* () {
      yield new _swagger.SwaggerApp(ExpressEngine).initialize().then(_helpers.Log.info).catch(_helpers.Log.error);
    })();
  }
  static initializeSocket() {
    return _asyncToGenerator(function* () {
      yield new _helpers.SocketAppHelper(ExpressEngine).initialize().then(_helpers.Log.info).catch(_helpers.Log.error);
    })();
  }
  static initializeGraphQLServer() {
    return _asyncToGenerator(function* () {
      yield new _Graphql.default(ExpressEngine).initialize().then(_helpers.Log.info).catch(_helpers.Log.error);
    })();
  }
  static initializeGlobalMiddleware() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      _this4.App.use("*", _helpers.AppHelper.useAppNotFoundRoute);
      _this4.App.use(_middleware.ErrorHelperMiddleware.use);
    })();
  }
}
var _default = exports.default = ExpressEngine;
//# sourceMappingURL=app.js.map