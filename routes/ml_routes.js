const express = require("express");
const router = express.Router();

const {
  findNearestDriverController,
  clusteringAndSortingController,
} = require("../controller/ml_controller");

// GET /api/ml/find_nearest_driver/:user_id
router.get("/find_nearest_driver/:user_id", findNearestDriverController);

// GET /api/ml/clustering_and_sorting
router.get("/clustering_and_sorting", clusteringAndSortingController);

module.exports = router;
