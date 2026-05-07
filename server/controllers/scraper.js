const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const scrape = async () => {
  const { data } = await axios.get("https://news.ycombinator.com", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const $ = cheerio.load(data);
  const stories = [];

  $(".athing").slice(0, 10).each((_, el) => {
    const hnId = $(el).attr("id");
    const titleEl = $(el).find(".titleline > a").first();
    const title = titleEl.text().trim();
    const url = titleEl.attr("href") || "";

    const subRow = $(el).next("tr");
    const points = parseInt(subRow.find(".score").text()) || 0;
    const author = subRow.find(".hnuser").text().trim();
    const postedAt = subRow.find(".age").attr("title") || subRow.find(".age").text().trim();

    if (title && hnId) {
      stories.push({ hnId, title, url, points, author, postedAt });
    }
  });

  const ops = stories.map((s) => ({
    updateOne: {
      filter: { hnId: s.hnId },
      update: { $set: s },
      upsert: true,
    },
  }));

  if (ops.length) await Story.bulkWrite(ops);

  return stories.length;
};

module.exports = { scrape };
