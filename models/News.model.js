const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required."],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is Required."],
      maxLength: [500, "description max length of 500 char"],
    },
    date: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    related_projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
