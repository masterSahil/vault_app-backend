const express = require("express");
const multer = require("multer");
const fileController = require("../controller/fileController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Get all files
router.get("/files", fileController.getFiles);

// ✅ Upload file
router.post("/files", upload.single("file"), fileController.createFile);

// ✅ Update file + metadata
router.put("/files/:id", upload.single("file"), fileController.updateFile);

// ✅ Delete file
router.delete("/files/:id", fileController.deleteFile);

module.exports = router;
