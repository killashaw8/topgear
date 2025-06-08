import express from "express";
const routerAdmin = express.Router();
import adminController from "../src/controllers/admin.controller";

routerAdmin.post("/signup", 
  adminController.processSignup
)

routerAdmin.post("/login", 
  adminController.processLogin
)

export default routerAdmin;