const express = require("express");
const genericRouter = require("./generic-router");

const router = express.Router();


router.use("/", genericRouter);

module.exports = router;