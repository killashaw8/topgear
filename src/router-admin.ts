import express from "express";
const routerAdmin = express.Router();
import adminController from "./controllers/admin.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";

// Admin
routerAdmin.get("/", adminController.goHome);

routerAdmin
  .get("/signup", adminController.getSignup)
  .post("/signup", 
    makeUploader("members").single("memberImage"), 
    adminController.processSignup
  );

routerAdmin
  .get("/login", adminController.getLogin)
  .post("/login", adminController.processLogin);

routerAdmin.get("/logout", adminController.logout);

routerAdmin.get("/check-me", adminController.checkAuthSession);

routerAdmin.get("/me", adminController.verifyAdmin, adminController.getMyPage);
routerAdmin.post("/me", adminController.verifyAdmin, adminController.updateMyPage);
routerAdmin.post("/me/verify-password", adminController.verifyAdmin, adminController.verifyMyPassword);

// Products
routerAdmin.get(
  "/product/all", 
  adminController.verifyAdmin, 
  productController.getAllProducts
); 
routerAdmin.post(
  "/product/create", 
  adminController.verifyAdmin,
  //uploadProductImage.single("productImage"),
  makeUploader("products").array("productImages", 5), 
  productController.createNewProduct
); 
routerAdmin.post(
  "/product/:id", 
  adminController.verifyAdmin,
  productController.updateChosenProduct
); 

// User
routerAdmin.get(
  "/user/all",
  adminController.verifyAdmin,
  adminController.getUsers
);

routerAdmin.post(
  "/user/edit",
  adminController.verifyAdmin,
  adminController.updateChosenUser
)

export default routerAdmin;
