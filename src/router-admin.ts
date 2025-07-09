import express from "express";
const routerAdmin = express.Router();
import adminController from "../src/controllers/admin.controller";

routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/signuo", adminController.getSignup)
  .post("/signup", adminController.processSignup);

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin.post("/logout", adminController.logout);

routerAdmin.get("/check-me", adminController.checkAuthSession);

export default routerAdmin;