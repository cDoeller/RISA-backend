const fileUploader = require("../config/cloudinary.config")
const router = require("express").Router()

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.post("/", fileUploader.array("images", 5), isAuthenticated, (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      next(new Error("No files uploaded!"));
      return;
    }
    const fileUrls = req.files.map(file => file.path);
    res.json({ fileUrls });
  });

router.post("/", fileUploader.single("imageUrl"), isAuthenticated, (req,res,next)=>{
    if(!req.file){
        next(new Error("No File Uploaded!"))
        return
    }
    res.json({fileUrl:req.file.path})
})

module.exports = router