const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const orderController = require("../controller/order");

router.post("/assign-vendor", isAuth, orderController.assignVendor);
router.get("/search", isAuth, orderController.searchOrder);
router.get("/my-order", isAuth, orderController.GetMyOrders);
router.get("/get-detail/:orderId", isAuth, orderController.getOrderDetails);
router.get("/get-all", isAuth, orderController.GetAllOrders);
router.post("/create", isAuth, orderController.createOrder);
router.get("/dashboard", isAuth, orderController.GetMyDashboard);
router.get("/assign/:orderId/:userId", isAuth, orderController.assignOrder);
router.post("/check-item/:id", isAuth, orderController.acceptOrderItem);
router.post("/check-order/:id", isAuth, orderController.acceptOrder);
router.get("/get-order-item/:orderId", isAuth, orderController.getOrderItem);
router.get(
  "/get-admin-order-details/:orderId",
  isAuth,
  orderController.getAdminOrderDetails,
);

router.post("/submit-order-bill", isAuth, orderController.submitOrderBill);
router.get("/get-order-bills", isAuth, orderController.getOrderBills);
router.post("/create-order", orderController.createSalesOrder);
router.post(
  "/update-delivery-date",
  isAuth,
  orderController.updateDeliveryDate,
);

module.exports = router;
