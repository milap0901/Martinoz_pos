const express = require("express");
const { getTable } = require("../controllers/tableView.controller");

const router = express.Router();

router.get("/tableView", getTable);

module.exports = router;
