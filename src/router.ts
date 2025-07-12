import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/** MEMBER **/

router.get("/member/showroom", memberController.getShowroom);

router.post("/member/signup", 
  makeUploader("members").single("memberImage"),
  memberController.signup 
);

router.post("member/login", memberController.login);

router.post("/member/logout", 
  memberController.verifyAuth, 
  memberController.logout
);

router.get("/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post("/member/update",
  memberController.verifyAuth,
  makeUploader("members").single("memberImage"),
  memberController.updateMember
);

router.get("/member/top-users", memberController.getTopUsers);

/** PRODUCT **/

router.get("/product/all", productController.getProducts);

router.get("/product/:id", 
  memberController.retrieveAuth, 
  productController.getProduct
);

/** ORDER **/

router.post("/order/create", 
  memberController.verifyAuth, 
  orderController.createOrder
);

router.get("/order/all", 
  memberController.verifyAuth, 
  orderController.getMyOrders
);

router.post("/order/update", 
  memberController.verifyAuth, 
  orderController.updateOrder
);


export default router;