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
        image_url: { type: String },
        caption: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const General = mongoose.model("General", generalSchema);

module.exports = General;


// {
//   "about_short": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec massa eget dolor tincidunt varius sit amet at nisi.",
//   "about_long_general": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla accumsan lacinia dolor, at eleifend ex congue vel. Suspendisse potenti.",
//   "about_long_top": "Nunc euismod ultrices dui, et gravida magna mattis nec. Proin nec imperdiet risus. In gravida sollicitudin risus a lobortis.",
//   "about_headline_top": "Welcome to our website!",
//   "about_long_bottom": "Pellentesque facilisis metus elit, nec fringilla purus ultrices in. Phasellus bibendum felis vel ornare ultricies.",
//   "about_headline_bottom": "Contact us for more information",
//   "slideshow_data": [
//     {
//       "image_url": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
//       "caption": ["Caption 1", "Caption 2"]
//     },
//     {
//       "image_url": ["https://example.com/image3.jpg", "https://example.com/image4.jpg"],
//       "caption": ["Caption 3", "Caption 4"]
//     }
//   ]
// }