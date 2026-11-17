const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const outletController = require("../controller/outlet");

router.get("/dashboard/:id", isAuth, outletController.dashboard);
router.get("/get-enquiries/:id", isAuth, outletController.totalEnquiry);
router.get(
  "/measurement-aging/:id",
  isAuth,
  outletController.StoreWiseMesurementAging,
);
router.get("/qc-completed/:id", isAuth, outletController.StoreWiseQcCompleted);
router.get(
  "/order-created/:id",
  isAuth,
  outletController.StoreWiseOrderCreated,
);
router.get("/total-enquiry/:id", isAuth, outletController.StoreWiseTotal);
router.get(
  "/estimate-completed/:id",
  isAuth,
  outletController.StoreWiseShareEstimateAging,
);
router.get(
  "/installation-aging/:id",
  isAuth,
  outletController.InstallerWiseInstallationAging,
);
router.get(
  "/installation-completed/:id",
  isAuth,
  outletController.InstallerWiseInstallationComplete,
);
router.get(
  "/installation-started/:id",
  isAuth,
  outletController.InstallerWiseInstallationStarted,
);
router.get("/complaint-list/:id", isAuth, outletController.complaintList);

module.exports = router;
