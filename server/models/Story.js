const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    hnId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    url: { type: String, default: "" },
    points: { type: Number, default: 0 },
    author: { type: String, default: "" },
    postedAt: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
