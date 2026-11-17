const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/jwt");

const superAdminController = require("../controller/super-admin");

router.get("/check-noti", isAuth, superAdminController.check_notification); //

router.get("/items-excel", isAuth, superAdminController.itemsExcel);
router.get(
  "/customer-ledger-excel",
  isAuth,
  superAdminController.customerLedgerExcel,
);
router.get("/download-pdf", isAuth, superAdminController.downloadInvoicePdf);
router.get("/get-category", isAuth, superAdminController.getCategory);
router.get("/stock-item-list", isAuth, superAdminController.stockItemList); //
router.get(
  "/stock-item-details",
  isAuth,
  superAdminController.stockItemDetails,
); //
router.get(
  "/stock-common-details/:code",
  isAuth,
  superAdminController.stockCommonDetails,
);
router.get("/customer", isAuth, superAdminController.customer);
router.get("/customer-ledger", isAuth, superAdminController.customerLedger); //
router.get("/total-balance", isAuth, superAdminController.totalBalance); //
router.get("/get-invoice", isAuth, superAdminController.getInvoice);
router.get("/get-invoice-details", isAuth, superAdminController.InvoiceDetails);
router.get("/delivery-names", isAuth, superAdminController.deliveryNames); //
router.get("/get-brands", isAuth, superAdminController.getBrands);
router.get("/get-collections", isAuth, superAdminController.getCollections);
router.get("/sales-orders", isAuth, superAdminController.salesOrders); //
router.get(
  "/sales-order-details/:code",
  isAuth,
  superAdminController.salesOrdersDetails,
);
router.get("/get-alternate-items", isAuth, superAdminController.getAlternate);
router.get(
  "/get-enquiry-summary-details",
  isAuth,
  superAdminController.getEnquirySummaryDetails,
);

router.get("/new-dashboard", isAuth, superAdminController.newDashboard);
router.get("/search-enquiry", isAuth, superAdminController.searchEnquiry); //
router.get("/dashboard", isAuth, superAdminController.dashboard); //
router.get("/get-items", isAuth, superAdminController.getItems);
router.get("/add-item", isAuth, superAdminController.addItem);

router.post("/create-user", isAuth, superAdminController.createUser); //
router.get("/cancel-enquiry/:id", isAuth, superAdminController.cancelEnquiry); //
router.get("/reopen-enquiry/:id", isAuth, superAdminController.reopenEnquiry);

router.post("/create-warehouse", isAuth, superAdminController.createWarehouse); //
router.get("/warehouses", isAuth, superAdminController.getAllWarehouse); //
router.post(
  "/update-warehouse/:id",
  isAuth,
  superAdminController.updateWarehouse,
); //
router.get("/warehouse/:id", isAuth, superAdminController.getWarehouse); //
router.post(
  "/delete-warehouse/:id",
  isAuth,
  superAdminController.deleteWarehouse,
); //
// router.post('/add-outlet',isAuth,superAdminController.createOutlet);//

router.put("/edit-user/:id", isAuth, superAdminController.editUser);
router.get("/get-users", isAuth, superAdminController.getAllUser); //
router.get("/get-measurer/:id", isAuth, superAdminController.get_measurer_data); //
router.get("/get-user/:id", isAuth, superAdminController.getUser); //
router.delete("/delete-user/:id", isAuth, superAdminController.deleteUser); //

router.get("/get-outlet", isAuth, superAdminController.getAllOutlet);
router.get("/get-outlet/:outletId", isAuth, superAdminController.getAOutlet);
router.get(
  "/get-outlet-customer/:id",
  isAuth,
  superAdminController.getAOutletCustomers,
);
router.get("/get-outlet-ic/:id", isAuth, superAdminController.getAOutletIC);
router.get(
  "/get-outlet-enquiry/:id",
  isAuth,
  superAdminController.getAOutletEnquiry,
);

router.get("/get-customers", isAuth, superAdminController.getAllCustomer); //
router.get("/get-customer/:id", isAuth, superAdminController.getCustomer); //
router.put(
  "/edit-customer-detail/:id",
  isAuth,
  superAdminController.editCustomerDetails,
); //
router.put(
  "/edit-customer-address/:id",
  isAuth,
  superAdminController.editCustomerAddress,
); //

router.get("/get-enquiries", isAuth, superAdminController.getAllEnquiries); //
router.get("/get/enquiries", isAuth, superAdminController.getAllEnquiries2); //
router.get("/get-enquiry/:id", isAuth, superAdminController.getEnquiry); //
router.get(
  "/get-enquiry-status/:id",
  isAuth,
  superAdminController.getAEnquiryStatus,
); //
router.get("/get-roles", isAuth, superAdminController.getRoles); //

router.post("/create-schedule", isAuth, superAdminController.createSchedule); //
router.get("/get-schedule", isAuth, superAdminController.getSchedule); //
router.put("/update-schedule/:id", isAuth, superAdminController.updateSchedule);
router.get(
  "/get-installer-schedule",
  isAuth,
  superAdminController.getScheduleInstaller,
); //
router.post(
  "/get-unassigned-user",
  //isAuth,
  superAdminController.get_unassign_user,
); //
router.get(
  "/get-unassigned-timeslot/:userid",
  //isAuth,
  superAdminController.get_unassign_timeslot,
);

router.get(
  "/send-mail-customer/:id",
  isAuth,
  superAdminController.send_mail_customer,
); //
router.post("/decode-mail/:id", isAuth, superAdminController.decode_mail); //
router.get("/get-notification", isAuth, superAdminController.getNotification); //
router.get(
  "/get-enquiry-schedule",
  isAuth,
  superAdminController.getEnquirySchedule,
); //

router.get(
  "/storewise-measurement-aging",
  isAuth,
  superAdminController.StoreWiseMesurementAging,
);
router.get(
  "/storewise-installation-aging",
  isAuth,
  superAdminController.InstallerWiseInstallationAging,
);
router.get(
  "/store-wise-QcReport",
  isAuth,
  superAdminController.StoreWiseQcReport,
);

router.get(
  "/storewise-qc-completed",
  isAuth,
  superAdminController.StoreWiseQcCompleted,
);
router.get(
  "/storewise-order-created",
  isAuth,
  superAdminController.StoreWiseOrderCreated,
);
router.get(
  "/storewise-qc1-completed",
  isAuth,
  superAdminController.StoreWiseQc1Done,
);
router.get(
  "/storewise-qc2-completed",
  isAuth,
  superAdminController.StoreWiseQc2Done,
);
router.get("/storewise-total", isAuth, superAdminController.StoreWiseTotal);
router.get(
  "/storewise-cancelled",
  isAuth,
  superAdminController.StoreWiseCancellation,
);
router.get(
  "/storewise-estimate-aging",
  isAuth,
  superAdminController.StoreWiseShareEstimateAging,
);
router.get(
  "/installer-installation-started/:id",
  isAuth,
  superAdminController.InstallerWiseInstallationStarted,
);
router.get(
  "/installer-installation-completed",
  isAuth,
  superAdminController.InstallerWiseInstallationComplete,
);
router.get(
  "/saleswise-measurement-aging/:id",
  isAuth,
  superAdminController.SalesWiseMesurementAging,
);
router.get(
  "/saleswise-estimate-aging/:id",
  isAuth,
  superAdminController.SalesWiseMesurementAging,
);
// router.get('/storewise-order-aging/:id', superAdminController.StoreWiseOrderConfirmation);
// router.get('/saleswise-order-aging/:id', superAdminController.SalesWiseOrderConfirmation);
// router.get('/storewise-lead-conversion', superAdminController.StoreWiseLeadAndConversion);
// router.get('/measurerwise-lead-conversion', superAdminController.MeasurerWiseLeadAndConversion);
// router.get('/saleswise-lead-conversion', superAdminController.SalesWiseLeadAndConversion);
// router.get('/storewise-cancelled-lead/:id', superAdminController.StoreWiseCancellationLeads);
// router.get('/saleswise-cancelled-lead/:id', superAdminController.SalesWiseCancellationLeads);
// router.get('/storewise-top-ic/:id', superAdminController.StoreWiseHighestEnquiryMaker);
// router.get('/saleswise-top-ic', superAdminController.SalesWiseHighestEnquiryMaker);
// router.get('/storewise-top-category', superAdminController.StoreWiseTopCategory);
// router.get('/saleswise-top-category', superAdminController.ICWiseTopCategory);
// router.get('/top-measurer', superAdminController.MeasurerWiseHighestEnquiryMaker);
// router.get('/measurerwise-measurement-aging/:id', superAdminController.MeasurerWiseMesurementAging);
router.get(
  "/top-installer",
  isAuth,
  superAdminController.InstallersWiseHighestEnquiryMaker,
);
router.get(
  "/measurer/task-aging/:id",
  isAuth,
  superAdminController.MeasurerWiseMesurementTaskAging,
);
router.get(
  "/installer/task-aging/:id",
  isAuth,
  superAdminController.InstallerWiseInstallationTaskAging,
);
router.get(
  "/download-curtain-fabric-data",
  isAuth,
  superAdminController.downloadCurtainFabricData,
);
router.get(
  "/material-receiving-report",
  isAuth,
  superAdminController.materialReceivingReport,
);

// router.get('/installer-installation-aging/:id', superAdminController.InstallerWiseInstallationAging);
// router.get('/installer-installation-completed/:id', superAdminController.InstallerWiseInstallationComplete);
router.get(
  "/storewise-all-enquiry",
  isAuth,
  superAdminController.storewiseAllEnquiry,
);
router.get(
  "/pending-mesurment-list",
  isAuth,
  superAdminController.pendingMesurement,
);
// router.get('/storewise-estimate-list', superAdminController.storewiseEstimate);
router.get(
  "/storewise-order-list",
  isAuth,
  superAdminController.storewiseOrderList,
);
router.get(
  "/storewise-qc1-list",
  isAuth,
  superAdminController.storewiseQc1List,
);
router.get("/qc-completed-list", isAuth, superAdminController.qcCompletedList);
router.get(
  "/installation-completed-list",
  isAuth,
  superAdminController.installationCompletedList,
);
router.get(
  "/storewise-cancelled-list",
  isAuth,
  superAdminController.StoreWiseCancellationList,
);

router.post("/sofa-sub-type/add", isAuth, superAdminController.AddSofaSubType);
router.post("/sofa/add", isAuth, superAdminController.AddSofaType);
router.get("/sofa/delete/:id", isAuth, superAdminController.deleteSofaType);

router.post(
  "/create-complaints",
  isAuth,
  superAdminController.createComplaints,
);
router.delete(
  "/delete-complaint/:id",
  isAuth,
  superAdminController.deleteComplaint,
);
router.get(
  "/get-complaints/:materialId",
  isAuth,
  superAdminController.getComplaints,
);
router.get(
  "/get-customer-complaints",
  isAuth,
  superAdminController.customerComplaints,
);

router.get(
  "/get-complaint-detail/:id",
  isAuth,
  superAdminController.getComplaintDetail,
);
router.post("/add-remark", isAuth, superAdminController.add_remark);
router.put(
  "/complaint-resolved/:id",
  isAuth,
  superAdminController.complaintResolved,
);
router.get(
  "/customer-complaints-excel",
  isAuth,
  superAdminController.customerComplaintsExcel,
);
router.get("/feedback-excel", isAuth, superAdminController.feedbackExcel);
router.get("/wcr-report", isAuth, superAdminController.wcrReport);

router.post("/sendMail/:id", isAuth, superAdminController.sendMail);
router.post(
  "/enquiry-completed",
  isAuth,
  superAdminController.enquiryCompleted,
);
router.get(
  "/create-estimate/:enquiryId",
  isAuth,
  superAdminController.createEstimate,
);
router.post(
  "/postponed-estimate",
  isAuth,
  superAdminController.postponedEstimate,
);

router.get(
  "/get-measurer-enquiry",
  isAuth,
  superAdminController.get_measurer_enquiry,
);
router.get(
  "/get-installer-tasks",
  isAuth,
  superAdminController.getInstallerTasks,
);

module.exports = router;
