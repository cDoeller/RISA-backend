const mongoose = require("mongoose");

const generalSchema = new mongoose.Schema(
  {
    about_short: {
      type: String,
      maxLength: [250, "abstract max length of 250 char"],
    },
    about_long_general: {
      type: String,
    },
    about_long_top: {
      type: String,
    },
    about_headline_top: {
      type: String,
    },
    about_long_bottom: {
      type: String,
    },
    about_headline_bottom: {
      type: String,
    },
    slideshow_data: [
      {
        image_url: { type: [String] },
        caption: { type: [String] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const General = mongoose.model("General", generalSchema);

module.exports = General;
