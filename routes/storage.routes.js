const express = require("express");
const router = express.Router();
const { getUploadUrl } = require("../controllers/storage.controller");

router.post("/storage/upload", getUploadUrl);

module.exports = router;
