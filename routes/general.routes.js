// import model
const General = require("../models/General.model");

// import Router Object
const router = require("express").Router();
// import auth middleware
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET
router.get("/", (req, res) => {
  General.find()
    .then((Data) => {
      res.status(200).json(Data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// POST
router.post("/", (req, res) => {
  const data = req.body
  General.create(data)
    .then((generalData) => {
      res.status(200).json(generalData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE
router.patch("/:id", isAuthenticated, async (req, res) => {
  try {
    const newGeneral = await General.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(newGeneral);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// EXPORT ROUTER
module.exports = router;
