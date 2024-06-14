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


// {
//   "title": "Speculative Sensing",
//   "description": "This is a sample project description.",
//   "short_description": "Short description of the project.",
//   "year": 2022,
//   "images_url": [
//     "https://www.christiandoeller.de/Images/works/specSens/sps2_4_Q0A9379.jpeg",
//     "hhttps://www.christiandoeller.de/Images/works/specSens/sps1_Q0A9355.jpeg"
//   ],
//   "tags": "installation",
//   "link": "https://www.christiandoeller.de/specSens.html"
// }