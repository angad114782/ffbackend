const express = require('express');

const router = express.Router();

const staController = require('../controller/sta-controller');

router.post('/get-sta' , staController.getSta);
router.get('/get-sta-status/:enquiryId', staController.getStaStatus);

module.exports = router;