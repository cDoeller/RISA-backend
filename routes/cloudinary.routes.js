const fileUploader = require("../config/cloudinary.config");
const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// body form key must be called "file"
router.post(
    "/single",
    fileUploader.single("file"),
    isAuthenticated,
    (req, res, next) => {
      if (!req.file) {
        next(new Error("No File Uploaded!"));
        return;
      }
      res.json({ fileUrl: req.file.path });
    }
  );

// body form key muste be called "files"
router.post(
  "/multiple",
  fileUploader.array("files", 5),
  isAuthenticated,
  (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      next(new Error("No files uploaded!"));
      return;
    }
    const fileUrls = req.files.map((file) => file.path);
    res.json({ fileUrls });
  }
);



module.exports = router;
