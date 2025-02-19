import { Router } from "express";
import { UserController } from "@/api/rest";
import { UploadMiddleware, RoleMiddleware } from "@/middleware";
import { Permissions } from "@/helpers/role/Role.definations";
const UserRoutes = Router();

UserRoutes.route("/create").post(
  RoleMiddleware.role(Permissions.READ),
  UploadMiddleware.upload.single("file"),
  UserController.getUsers
);

export default UserRoutes;
