const express = require("express");
const { getCustomers } = require("../controllers/customers.controller");
const router = express.Router();

router.get("/customers", getCustomers);

module.exports = router;
