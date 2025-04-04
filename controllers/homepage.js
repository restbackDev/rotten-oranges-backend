const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
// const users = require("../models/hoot.js");
const router = express.Router();

// GET /homepage
router.get('/', async (req,res) => {
  try {
    res.send("Hello user this is the homepage")
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;