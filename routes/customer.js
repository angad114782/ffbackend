const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/jwt");
const customerController = require("../controller/customer");
const { whatsappMessage } = require("../helper/mailer");

router.get("/get-my-enquiry/:id", isAuth, customerController.getMyEnquiry);
router.post("/make-a-complaint", isAuth, customerController.makeAComplaint);
router.get("/get-my-room", isAuth, customerController.getMyRoom);
router.get(
  "/get-complaints-category-wise",
  isAuth,
  customerController.getComplaintCategoryWise,
);
router.post("/add-feedback", customerController.addFeedback);
router.get("/get-feedback", isAuth, customerController.getFeedback);
router.get("/send-message", isAuth, customerController.sendMessage);
router.get(
  "/installation-message/:enquiryId",
  isAuth,
  customerController.sendInstallationMessage,
);

router.post(
  "/installer-slot-booking",
  isAuth,
  customerController.installer_slot_booking,
);
router.get(
  "/get-installer-slot",
  isAuth,
  customerController.get_installer_slot,
);

router.post(
  "/measurer-slot-booking",
  isAuth,
  customerController.measurerSlotBooking,
);
router.get("/get-measurer-slot", isAuth, customerController.get_measurer_slot);

router.post(
  "/assign-installer",
  isAuth,
  customerController.assign_installer_for_complaint,
);
router.post(
  "/add-complaint-remark",
  isAuth,
  customerController.addComplaintRemark,
);
router.post(
  "/add-complaint-images/:id",
  isAuth,
  customerController.addComplaintImages,
);
router.post(
  "/delete-complaint-images/:id",
  isAuth,
  customerController.deleteComplaintImages,
);

router.get("/walkin-data", isAuth, customerController.walkinData);
router.post("/add-client", isAuth, customerController.addClient);
router.get("/get-client", isAuth, customerController.getClient);
router.get("/delete-client/:id", isAuth, customerController.deleteClient);
router.get("/get-client/:id", isAuth, customerController.getClientById);
router.post("/update-client/:id", isAuth, customerController.updateClient);

router.get("/walkin-dashboard", isAuth, customerController.walkinDashboard);
router.get("/walkin-report", isAuth, customerController.walkinReportExcel);
module.exports = router;
