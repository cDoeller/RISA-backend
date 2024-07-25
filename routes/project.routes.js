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

// GET / TAG SEARCH
router.get("/search-frontend", (req, res) => {
  const { tags } = req.query;
  const tagsArray = tags.split(",");

  let searchQuery = {};

  if (tags && tags.includes("research projects")) {
    const index = tagsArray.indexOf("research projects");
    tagsArray.splice(index, 1);
    if (tagsArray.length > 0) {
      searchQuery = {
        $and: [{ tags: { $in: tagsArray } }, { is_umbrella_project: true }],
      };
    } else {
      searchQuery = { is_umbrella_project: true };
    }
  } else {
    if (tags) searchQuery = { tags: { $in: tagsArray } };
  }

  console.log(searchQuery);

  Project.find(searchQuery)
    .then((projects) => {
      res.status(200).json(projects);
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
    // create
    const newProject = await Project.create(req.body);
    // * PROJECTS UPDATES
    if (newProject.is_umbrella_project) {
      // 1) umbrella = set as umbrella proj of related
      const updatedProject = await Project.updateMany(
        { _id: { $in: newProject.related_projects } },
        { $set: { umbrella_project: newProject._id } },
        { new: true }
      );
    } else {
      // 2) !umbrella / related = push in related proj array of umbrella
      if (newProject.umbrella_project) {
        const updatedProject = await Project.findByIdAndUpdate(
          newProject.umbrella_project,
          { $addToSet: { related_projects: newProject._id } },
          { new: true }
        );
      }
    }
    // * CONTRIBUTOR UPDATE
    // 1) find related contributors
    const relatedContributorIds = newProject.contributors;
    const relatedContributors = await Contributor.find({
      _id: { $in: relatedContributorIds },
    });
    // 2) add project to contributors
    relatedContributors.forEach(async (c) => {
      c.projects.push(newProject._id);
      await c.save();
    });
    // response
    res.status(200).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// UPDATE one project
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const newProject = req.body;
    console.log("newProject", newProject);
    const oldProject = await Project.findByIdAndUpdate(req.params.id, req.body);
    console.log("oldProject", oldProject);
    // HANDLE RELATIONS
    if (newProject.is_umbrella_project) {
      // >> Umbrella: handle related projects
      // 1) compare old and new related porjects
      const newRelated = newProject.related_projects.map((id) => id.toString());
      const oldRelated = oldProject.related_projects.map((id) => id.toString());
      console.log("newRelated", newRelated);
      console.log("oldRelated", oldRelated);
      const addedRelated = newRelated.filter((project) => {
        return !oldRelated.includes(project);
      });
      const removedRelated = oldRelated.filter((project) => {
        return !newRelated.includes(project);
      });
      // 2) handle added related
      if (addedRelated.length > 0) {
        const newRelationsNeeded = await Project.find({
          _id: { $in: newRelated },
        });
        for (const project of newRelationsNeeded) {
          for (const id of newRelated) {
            // a) set umbrella project
            if (project.umbrella_project !== oldProject._id) {
              project.umbrella_project = oldProject._id;
            }
            // b) set related projects
            // > dont include itself in itlsef
            // > dont include already included
            if (
              id !== project._id.toString() &&
              !project.related_projects.includes(id)
            ) {
              project.related_projects.push(id);
            }
            await project.save();
          }
        }
      }
      // 3) handle removed related
      if (removedRelated.length > 0) {
        // a) remove relations in removed projects
        const RelationsToDeleteRemoved = await Project.find({
          _id: { $in: removedRelated },
        });
        for (const project of RelationsToDeleteRemoved) {
          for (const removedId of removedRelated) {
            // a) reset umbrella project
            project.umbrella_project = null;
            // b) remove related
            if (removedId !== project._id.toString()) {
              const index = project.related_projects.indexOf(removedId);
              if (index > -1) project.related_projects.splice(index, 1);
            }
            await project.save();
          }
        }
      }
      // b) remove relations in still related projects
      const RelationsToDeleteRemaining = await Project.find({
        _id: { $in: newRelated },
      });
      for (const project of RelationsToDeleteRemaining) {
        for (const removedId of removedRelated) {
          // remove removed related
          if (removedId !== project._id.toString()) {
            const index = project.related_projects.indexOf(removedId);
            if (index > -1) project.related_projects.splice(index, 1);
          }
          await project.save();
        }
      }
    } else {
      // >> !umbrella / related: handle projects of contributors
      // 1) compare old and new contributors
      const newContributorIds = newProject.contributors.map((id) =>
        id.toString()
      );
      const oldContributorIds = oldProject.contributors.map((id) =>
        id.toString()
      );
      const addedContrib = newContributorIds.filter((contributor) => {
        return !oldContributorIds.includes(contributor);
      });
      const removedContrib = oldContributorIds.filter((contributor) => {
        return !newContributorIds.includes(contributor);
      });
      // 2) handle added contributors
      if (addedContrib.length > 0) {
        const newRelationsNeeded = await Contributor.find({
          _id: { $in: addedContrib },
        });
        // console.log("new relations needed:", newRelationsNeeded);
        for (const contributor of newRelationsNeeded) {
          contributor.projects.push(oldProject._id);
          await contributor.save();
        }
      }
      // 3) handle removed contributors
      if (removedContrib.length > 0) {
        const relationsToDelete = await Contributor.find({
          _id: { $in: removedContrib },
        });
        for (const contributor of relationsToDelete) {
          const index = contributor.projects.indexOf(oldProject._id);
          if (index > -1) {
            contributor.projects.splice(index, 1);
            await contributor.save();
          }
        }
      }
    }
    res.status(200).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
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
