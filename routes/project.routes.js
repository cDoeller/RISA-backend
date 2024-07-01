// import model
const Project = require("../models/Project.model");
// import Router Object
const router = require("express").Router();
// import auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET :: all projects
router.get("/", (req, res) => {
  Project.find()
    .populate("contributors")
    .populate("research_project")
    .then((Projects) => {
      res.status(200).json(Projects);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET :: one Project
router.get("/:id", (req, res) => {
  Project.findById(req.params.id)
    .populate("contributors")
    .populate("research_project")
    .then((Project) => {
      res.status(200).json(Project);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST :: project
router.post("/", isAuthenticated, (req, res) => {
  Project.create(req.body)
    .then((newProject) => {
      res.status(200).json(newProject);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

  // UPDATE one project
  router.patch("/:id", isAuthenticated, (req, res) => {
    Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((updatedProject) => {
        res.status(200).json(updatedProject);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  });
  
// DELETE
router.delete("/:id", isAuthenticated, (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then((deletedProject) => {
      console.log(deletedProject);
      res.status(200).json(deletedProject);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// EXPORT ROUTER
module.exports = router;
