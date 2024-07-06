const mongoose = require("mongoose");

const contributorSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Name is Required."],
    unique
  },
  name: {
    type: String,
    required: [true, "Name is Required."],
    unique
  },
  short_bio: {
    type: String,
    required: [true, "Short bio is Required."],
  },
  email: {
    type: String,
    required: [true, "Email is Required."],
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  website_url: {
    type: String,
  },
  social_media: {
    insta: { type: String },
    x: { type: String },
  },
});

const Contributor = mongoose.model("Contributor", contributorSchema);

module.exports = Contributor;

// {
//     "name": "John Doe",
//     "short_bio": "Web Developer with a passion for coding",
//     "email": "johndoe@example.com",
//     "projects": ["6134cc53050f06e8bf8b4567", "6134cc53050f06e8bf8b4568"],
//     "website_url": "https://www.johndoe.com",
//     "social_media": {
//       "insta": "@johndoe",
//       "x": "johndoe"
//     }
//   }