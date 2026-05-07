const express = require("express");
const { scrape } = require("../controllers/scraper");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const count = await scrape();
    res.json({ message: `Successfully scraped ${count} stories` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
