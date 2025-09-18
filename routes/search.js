// routes/search.js
const express = require("express");
const Note = require("../model/notes.js");
const Doc = require("../model/file.js");
const Link = require("../model/link.js");
const Cred = require("../model/creds.js");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q, userId } = req.query; // ✅ get userId from request
  try {
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const regex = new RegExp(q, "i"); // case-insensitive search

    const [notes, docs, links, creds] = await Promise.all([
      Note.find({ userId, $or: [{ title: regex }, { content: regex }] }),
      Doc.find({ userId, $or: [{ title: regex }, { description: regex }] }),
      Link.find({ userId, $or: [{ url: regex }, { title: regex }] }),
      Cred.find({ userId, $or: [{ username: regex }, { site: regex }] }),
    ]);

    res.json({ notes, docs, links, creds });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;