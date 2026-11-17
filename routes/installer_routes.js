const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const installerController = require("../controller/installer");

router.get("/dashboard", isAuth, installerController.getMyTasksCount);
router.get("/my-tasks", isAuth, installerController.getMyTasks);
router.post("/order/:id", isAuth, installerController.GetOrderPackage);
router.post("/verify-order/:id", isAuth, installerController.verifyOTP);
router.post(
  "/get-unassign-installer",
  //isAuth,
  installerController.get_unassign_user,
);
router.post("/assign-installer", isAuth, installerController.assign_installer);
router.post("/update-schedule", installerController.updateSchedules);
// router.post('/add-wcr/:enquiryId', installerController.add_wcr)
// router.get('/get-wcr/:enquiryId', installerController.get_wcr)

router.get("/get-wcr-checks", isAuth, installerController.getWcrChecks);
router.post("/add-wcr-report", isAuth, installerController.addWcrReport);
router.get(
  "/get-wcr-report/:enquiryId",
  isAuth,
  installerController.getWcrReport,
);

router.get(
  "/unassign-installer-slot",
  //isAuth,
  installerController.get_unassign_user_slot,
);

module.exports = router;
