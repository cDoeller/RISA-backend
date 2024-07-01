// import model
const Contributor = require("../models/Contributor.model");
// import Router Object
const router = require("express").Router();
// import auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET 
router.get("/", (req, res) => {
    Contributor.find()
    .populate("projects")
    .then((Contributors) => {
      res.status(200).json(Contributors);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST 
router.post("/", isAuthenticated, (req, res) => {
    Contributor.create(req.body)
    .then((newContributor) => {
      res.status(200).json(newContributor);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE
router.delete("/:id", isAuthenticated, (req,res)=>{
  Contributor.findByIdAndDelete(req.params.id)
  .then((deletedContributor) => {
    console.log(deletedContributor);
    res.status(200).json(deletedContributor);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
})

// EXPORT ROUTER
module.exports = router;
