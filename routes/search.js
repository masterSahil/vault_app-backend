// routes/search.js
const express = require("express");
const Note = require("../model/notes.js");
const Doc = require("../model/file.js");
const Link = require("../model/link.js");
const Cred = require("../model/creds.js");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const regex = new RegExp(q, "i"); // case-insensitive search

    const [notes, docs, links, creds] = await Promise.all([
      Note.find({ $or: [{ title: regex }, { content: regex }] }),
      Doc.find({ $or: [{ title: regex }, { description: regex }] }),
      Link.find({ $or: [{ url: regex }, { title: regex }] }),
      Cred.find({ $or: [{ username: regex }, { site: regex }] }),
    ]);

    res.json({ notes, docs, links, creds });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;