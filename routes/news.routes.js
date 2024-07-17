// import model
const News = require("../models/News.model");
const Project = require("../models/Project.model");
// import Router Object
const router = require("express").Router();
// import authen
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET ALL
router.get("/", (req, res) => {
  // SORT BY DATE
  News.find()
    .populate("related_projects")
    .then((news) => {
      res.status(200).json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET / FRONTEND NAME SEARCH
// router.get("/search-frontend", (req, res) => {
//   const { name } = req.query;
//   const searchQuery = { name: { $regex: name, $options: "i" } };

//   Contributor.find(searchQuery)
//     .populate("projects")
//     .then((contributors) => {
//       res.status(200).json(contributors);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// GET / ADMIN TITLE SEARCH
router.get("/search-cms", isAuthenticated, (req, res) => {
  const { title } = req.query;
  const searchQuery = { title: { $regex: title, $options: "i" } };

  News.find(searchQuery)
    .then((news) => {
      res.status(200).json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// GET :: id
router.get("/:id", (req, res) => {
  News.findById(req.params.id)
    .populate("related_projects")
    .then((news) => {
      res.status(200).json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const createdNews = await News.create(req.body);
    res.status(200).json(createdNews);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// UPDATE / PATCH
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const newNews = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(newNews);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// DELETE
router.delete("/:id", isAuthenticated, (req, res) => {
  News.findByIdAndDelete(req.params.id)
    .then((deletedNews) => {
      res.status(200).json(deletedNews);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// EXPORT ROUTER
module.exports = router;
