// import model
const Project = require("../models/Project.model");
const Contributor = require("../models/Contributor.model");

// import Router Object
const router = require("express").Router();
// import auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET :: all projects
router.get("/", (req, res) => {
  Project.find()
    .populate("contributors")
    .populate("umbrella_project")
    .populate("related_projects")
    .then((Projects) => {
      res.status(200).json(Projects);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET / ADMIN SEARCH
router.get("/search-cms", isAuthenticated, (req, res) => {
  const { title } = req.query;
  const searchQuery = { title: { $regex: title, $options: "i" } };

  Project.find(searchQuery)
    .then((projects) => {
      res.status(200).json(projects);
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
    .populate("umbrella_project")
    .populate("related_projects")
    .then((Project) => {
      res.status(200).json(Project);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST :: project
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // 1) find related contributors
    const relatedContributorIds = req.body.contributors;
    const relatedContributors = await Contributor.find({
      _id: { $in: relatedContributorIds },
    });
    // 2) create new project
    const newProject = await Project.create(req.body);
    // 3) add project to contributors
    relatedContributors.forEach(async (c) => {
      c.projects.push(newProject._id);
      await c.save();
    });
    res.status(200).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
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
