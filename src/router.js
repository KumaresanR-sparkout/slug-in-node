const express = require("express");
const { analyticAggregation } = require("./aggregations/analytic");
const { compressImage } = require('./compress-image');
const router = express.Router();


router.get('/analytic', analyticAggregation);
router.get("/compress-image", compressImage);


module.exports = router;