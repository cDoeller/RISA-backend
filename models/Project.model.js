const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required."],
  },
  description: {
    type: String,
    required: [true, "Description is Required."],
  },
  short_description: {
    type: String,
    required: [true, "Short description is Required."],
  },
  contributors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contributor",
    },
  ],
  year: {
    type: Number,
  },
  images_url: {
    type: [String],
    required: [true, "Upload at least one image"],
  },
  research_project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  tags: {
    type: String,
    enum: {
      values: [
        "installation",
        "performance",
        "workshop",
        "seminar",
        "exhibition",
        "article",
        "event",
      ],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
  link: {
    type: String,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
