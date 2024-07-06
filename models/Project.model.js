const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Title is Required."],
    unique:true,
  },
  title: {
    type: String,
    required: [true, "Title is Required."],
    unique:true,
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
  is_umbrella_project: {
    type: Boolean,
    default: false,
  },
  umbrella_project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  related_projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  tags: {
    type: [String],
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

  // remove project middleware
  // > delete from contributors
  // > delete in related arr and as umbrella
  projectSchema.pre('remove', async function(next) {
    await this.model('Project').updateMany(
      { _id: { $in: this.related_projects } },
      { $pull: { related_projects: this._id } }
    );
    await this.model('Project').updateMany(
      { umbrella_project: this._id },
      { $set: { umbrella_project: null } }
    );
    await this.model('Contributor').updateMany(
      { _id: { $in: this.contributors } },
      { $pull: { projects: this._id } }
    );
    next();
  });

module.exports = Project;
