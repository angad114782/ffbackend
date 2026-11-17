const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const authController = require("../controller/auth");

router.post("/login", (req, res, next) => {
  /*  #swagger.tags = ['Auth']
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'User credentials',
          required: true,
          schema: {
              $email: "admin@fandf.in",
              $password: "123456"
          }
      }
  */
  authController.login(req, res, next);
});
router.post("/create-vendor", isAuth, authController.createVendor);
router.get("/logout/:type", isAuth, authController.logout);
router.get(
  "/schedule-enquiry-list",
  isAuth,
  authController.schedule_enquiry_list,
);
router.post(
  "/assign-schedule-enquiry",
  isAuth,
  authController.assign_schedule_person,
);
router.post("/app-version", authController.app_version);
router.get("/app-version/:type", authController.get_version);
router.put("/block-user", isAuth, authController.blockUser);
router.post("/change-password", isAuth, authController.changePassword);

router.post("/send-otp", isAuth, authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
