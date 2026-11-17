const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const QualityController = require("../controller/qualitycheckController");

router.get("/get", isAuth, QualityController.getAllQualityChecks);
router.get("/get-qc", isAuth, QualityController.getAQualityCheck);
router.post("/create", isAuth, QualityController.createQualityCheck);
router.put("/update/:id", isAuth, QualityController.updateQualityCheck);
router.get("/delete/:id", isAuth, QualityController.deleteQualityCheck);
router.get("/block/:id", isAuth, QualityController.blockQualityCheck);
router.post("/submit", isAuth, QualityController.submitRemarks);
router.post("/check-quality/:id", isAuth, QualityController.CheckQuality);
router.post("/qc-complete/:id", isAuth, QualityController.completeQC);
router.post("/get-quality-checks", isAuth, QualityController.getQualityChecks);
router.post(
  "/update-fabric-status",
  isAuth,
  QualityController.updateFabricStaus,
);

router.put("/update-qc-remark", isAuth, QualityController.updateQcRemark);
router.post("/submit-multiple-qc", isAuth, QualityController.submitMultipleQc);

module.exports = router;
