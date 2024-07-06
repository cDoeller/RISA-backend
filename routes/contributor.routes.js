// import model
const Contributor = require("../models/Contributor.model");
const Project = require("../models/Project.model");
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

// GET / ADMIN SEARCH
router.get("/search-cms", isAuthenticated, (req, res) => {
  const { name } = req.query;
  const searchQuery = { name: { $regex: name, $options: "i" } };

  Contributor.find(searchQuery)
    .then((contributors) => {
      res.status(200).json(contributors);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET :: id
router.get("/:id", isAuthenticated, (req, res) => {
  Contributor.findById(req.params.id)
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
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const relatedProjectIds = req.body.projects;
    // 1) find all related projects
    const relatedProjects = await Project.find({
      _id: { $in: relatedProjectIds },
    });
    // 2) create the new contributor
    const createdContributor = await Contributor.create(req.body);
    // 3) Update the contributors array of each related project using forEach loop
    relatedProjects.forEach(async (project) => {
      project.contributors.push(createdContributor._id);
      await project.save();
    });
    res.status(200).json(createdContributor);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// UPDATE / PATCH
router.patch("/:id", isAuthenticated, (req, res) => {
  Contributor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedContributor) => {
      console.log(updatedContributor);
      res.status(200).json(updatedContributor);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// DELETE
router.delete("/:id", isAuthenticated, (req, res) => {
  Contributor.findByIdAndDelete(req.params.id)
    .then((deletedContributor) => {
      console.log(deletedContributor);
      res.status(200).json(deletedContributor);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// EXPORT ROUTER
module.exports = router;
