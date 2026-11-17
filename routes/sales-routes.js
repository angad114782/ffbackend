const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const salesController = require("../controller/sales-controller");

router.get("/dashboard", isAuth, salesController.icDashboard);
router.get(
  "/get-enquiry-by-status",
  isAuth,
  salesController.getEnquiryByStatus,
);
router.get("/get-profile", isAuth, salesController.userProfile);
router.post("/update-profile", isAuth, salesController.updateUserDetails);
router.get("/add-cartage", isAuth, salesController.addCartage);
router.post("/create-customer", isAuth, salesController.createCustomer);
router.post("/create-customer-ax", salesController.syncCustomerDataFromAX);
router.post("/generate-enquiry/:id", isAuth, salesController.generateEnquiry);
router.post("/create-room/:id", isAuth, salesController.createRoom);
router.delete("/delete-room/:id", isAuth, salesController.deleteRoom);
router.post("/edit-room/:id", isAuth, salesController.editRoom);
router.get("/get-materials", isAuth, salesController.getMaterials);
router.get("/get-curtain", isAuth, salesController.getCurtainFabric);
router.get("/get-sofa", isAuth, salesController.getSofaData);
router.get("/get-sheer", isAuth, salesController.getSheerFabric);
router.get("/get-border", isAuth, salesController.getBorderFabric);
router.get("/get-hardware", isAuth, salesController.getHardware);
router.get("/get-belt", isAuth, salesController.getBeltFabric);
router.get("/get-pelmet", isAuth, salesController.getPelmetFabric);
router.get("/get-blind-data", isAuth, salesController.getBlindData);
router.get("/get-blind-shades", isAuth, salesController.getBlindShades);
router.post("/post-data", isAuth, salesController.postMaterial);
router.put("/update-data", isAuth, salesController.updateRoomStyleData);
router.get("/get-room-data/:id", isAuth, salesController.getRoomData);
router.get("/get-customers", isAuth, salesController.getAllcustomer);
router.get("/get-customer/:id", isAuth, salesController.getACustomer);
router.get("/get-customer-by-date", isAuth, salesController.getACustomerByDate);
router.get("/get-enquiry-by-date", isAuth, salesController.getEnquiryByDate);
router.post("/get-enquiry-of-date", isAuth, salesController.getEnquiryByADate);
router.get("/get-roomlist/:id", isAuth, salesController.getRoomList);
router.get("/get-enquiry/:id", salesController.getEnquiry);
router.get("/admin/get-enquiry/:id", isAuth, salesController.getEnquiry);

router.get("/get-enquires", isAuth, salesController.getAllEnquiry);
router.get("/get-roomlist/:id", isAuth, salesController.getRoomList);
router.get("/get-customer", isAuth, salesController.getCustomerByName);
router.post("/set-token-amount/:id", isAuth, salesController.submitTokenAmount);
router.post("/upload-image/:id", isAuth, salesController.uploadRoomDataImage);
router.post("/delete-image", isAuth, salesController.deleteRoomDataImage);
router.post("/upload-blind-border", isAuth, salesController.createBorderTypes);
router.get("/sync-curtain", isAuth, salesController.syncCurtainData);
router.post("/sync-curtain-ax", salesController.syncCurtainFromAX);
router.get("/get-estimate/:id", salesController.GetEstimate);
router.get("/sync-customer", isAuth, salesController.syncCustomerData);
router.get("/sync-address", isAuth, salesController.syncCustomerAddressData);
router.get("/last-enquiry", isAuth, salesController.findLatestEnquiry);
router.get("/enquiry-detail/:id", isAuth, salesController.jasveerEnquiryInfo);
// router.get("/enq-detail/:id", isAuth, salesController.jasveerEnquiryInfo2);
router.get("/curtain", isAuth, salesController.findCurtainById);
router.get("/remove-wall/:id", isAuth, salesController.removeWall);
router.get("/delete-sofa/:id", isAuth, salesController.deleteSofa);
// router.get("/enquiry-info/:id" , salesController.jasveerEnquiryInfo2);
router.get("/customer-suggestion", isAuth, salesController.customerSuggestion);
router.get("/enquiry-status-count", isAuth, salesController.enquiryStatusCount);
router.get("/get-address/:id", salesController.getAddress);
router.get("/get-ladder", isAuth, salesController.getLadder);
router.post("/update-estimate", isAuth, salesController.updateEstimate);

// router.get('/copy-estimate/:id', isAuth, salesController.copyOfEstimate)

module.exports = router;
