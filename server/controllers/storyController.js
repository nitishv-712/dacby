const Story = require("../models/Story");
const User = require("../models/User");

const getStories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });

    const isBookmarked = user.bookmarks.some((id) => id.toString() === storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({ bookmarked: !isBookmarked, bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bookmarks");
    const sorted = [...user.bookmarks].sort((a, b) => b.points - a.points);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStories, getStory, toggleBookmark, getBookmarks };
