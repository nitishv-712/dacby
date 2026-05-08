require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { scrape } = require("./controllers/scraper");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stories", require("./routes/stories"));
app.use("/api/scrape", require("./routes/scrape"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await scrape();
    console.log("Initial scrape completed");

    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
};

start();
