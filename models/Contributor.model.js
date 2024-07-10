const mongoose = require("mongoose");

const contributorSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Name is Required."],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is Required."],
      unique: true,
    },
    short_bio: {
      type: String,
      required: [true, "Short bio is Required."],
      maxLength: [500, "shortbio max length of 500 char"]
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
  },
  {
    timestamps: true,
  }
);

const Contributor = mongoose.model("Contributor", contributorSchema);

// remove project middleware
// > delete from projects
contributorSchema.pre("remove", async function (next) {
  await this.model("Project").updateMany(
    { _id: { $in: this.contributors } },
    { $pull: { contributors: this._id } }
  );
  next();
});

module.exports = Contributor;
