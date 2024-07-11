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

// GET / FRONTEND NAME SEARCH
router.get("/search-frontend", (req, res) => {
  const { name } = req.query;
  const searchQuery = { name: { $regex: name, $options: "i" } };

  Contributor.find(searchQuery)
    .populate("projects")
    .then((contributors) => {
      res.status(200).json(contributors);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET / ADMIN NAME SEARCH
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
    // 1) find all related projects
    const relatedProjectIds = req.body.projects;
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
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const oldContributor = await Contributor.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const newContributor = req.body;
    // UPDATE PROJECTS RELATIONS
    // compare old and new projects
    const oldProjects = oldContributor.projects.map((id) => {
      return id.toString();
    });
    const newProjects = newContributor.projects.map((id) => {
      return id.toString();
    });
    const addedProjects = newProjects.filter((project) => {
      return !oldProjects.includes(project);
    });
    const removedProjects = oldProjects.filter((project) => {
      return !newProjects.includes(project);
    });
    // added
    if (addedProjects.length > 0) {
      const newRelationsNeeded = await Project.find({
        _id: { $in: addedProjects },
      });
      for (const project of newRelationsNeeded) {
        project.contributors.push(oldContributor._id);
        await project.save();
      }
    }
    // removed
    if (removedProjects.length > 0) {
      const RelationsToBeRemoved = await Project.find({
        _id: { $in: removedProjects },
      });
      for (const project of RelationsToBeRemoved) {
        const index = project.contributors.indexOf(oldContributor._id);
        project.contributors.splice(index, 1);
        await project.save();
      }
    }
    res.status(200).json(newContributor);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
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
