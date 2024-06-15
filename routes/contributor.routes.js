// import model
const Contributor = require("../models/Contributor.model");
// import Router Object
const router = require("express").Router();
// import auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET :: all projects
router.get("/", (req, res) => {
    Contributor.find()
    .then((Contributors) => {
      res.status(200).json(Contributors);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST :: project
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

// EXPORT ROUTER
module.exports = router;
