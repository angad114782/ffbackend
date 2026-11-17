const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const measurerController = require("../controller/measurer");

router.post("/add-assets", measurerController.add_assets);
router.post("/update-assets", measurerController.add_assets);
router.post("/add-hardware", isAuth, measurerController.add_hardware_detail);
router.post("/add-assets-image/:id", measurerController.add_assets_image);
router.post("/add-image", measurerController.add_image);
router.post("/delete-assets-image/:id", measurerController.remove_assets_image);
router.post("/edit-assets", isAuth, measurerController.edit_assets);
router.get("/get-assets-image/:id", measurerController.get_assets_image);
router.get(
  "/get-measurer-enquiry",
  isAuth,
  measurerController.get_measurer_enquiry,
);
router.get("/get-measurer-data", isAuth, measurerController.get_measurer_data);
router.get("/get-measurer-info", isAuth, measurerController.get_measurer_info);
router.get(
  "/get-measurer-enq",
  isAuth,
  measurerController.get_measurer_schedules,
);
router.get(
  "/get-measurer-notification",
  isAuth,
  measurerController.getMeasurerNotification,
);
router.post("/add-area", isAuth, measurerController.addArea);
router.get("/remove-area/:id", isAuth, measurerController.removeArea);
router.post("/add-window", isAuth, measurerController.addWindow);
router.get("/remove-window/:id", isAuth, measurerController.removeWindow);
router.post("/wallpaper/area/add", isAuth, measurerController.addWalpaperArea);
router.get(
  "/wallpaper/remove/area/:id",
  isAuth,
  measurerController.removeWallpaperArea,
);
router.post("/update-schedule", isAuth, measurerController.updateSchedules);

router.post(
  "/add-signature/:enquiryId",
  isAuth,
  measurerController.addClientSignature,
);
router.get(
  "/update-postpone-scheduled",
  isAuth,
  measurerController.updatePostponeScheduled,
);

module.exports = router;
