const express = require("express");
const { getAreas } = require("../controllers/areas.controller");
const router = express.Router();

router.get("/areas", getAreas);

module.exports = router;
