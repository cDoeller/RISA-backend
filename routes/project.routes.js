// import model
const Project = require("../models/Project.model");
// import Router Object
const router = require("express").Router();

// GET :: all projects
router.get("/", (req, res) => {
  Project.find()
    .then((Projects) => {
      res.status(200).json({ Projects });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST :: project
router.post("/", (req,res) => {
    Project.create(req.body)
    .then((newProject) => {
        res.status(200).json({ newProject });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
});

// EXPORT ROUTER
module.exports = router;