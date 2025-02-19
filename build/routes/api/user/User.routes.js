"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _rest = require("../../../api/rest");
var _middleware = require("../../../middleware");
var _Role = require("../../../helpers/role/Role.definations");
var UserRoutes = (0, _express.Router)();
UserRoutes.route("/create").post(_middleware.RoleMiddleware.role(_Role.Permissions.READ), _middleware.UploadMiddleware.upload.single("file"), _rest.UserController.getUsers);
var _default = exports.default = UserRoutes;
//# sourceMappingURL=User.routes.js.map