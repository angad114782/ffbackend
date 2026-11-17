const express = require("express");

const router = express.Router();

const paymentController = require("../controller/paymentController");
const isAuth = require("../middleware/jwt");

// router.get('/update-payment-status' , paymentController.updatePaymentStatus);
router.post("/send-payment-link", isAuth, paymentController.sendPaymentLink);
router.get("/payment-history", isAuth, paymentController.paymentHistory);
router.post("/razorpay-wabhook", paymentController.razorpayWabhook);
router.get(
  "/sent-payment-links",
  isAuth,
  paymentController.getSentPaymentLinks,
);

router.get("/sync-payment", isAuth, paymentController.syncPaymentInAX);
router.get(
  "/order-advance-reminder",
  isAuth,
  paymentController.orderAdvanceReminder,
);
router.get("/getCompletedOrder", isAuth, paymentController.getCompletedOrder);

module.exports = router;
