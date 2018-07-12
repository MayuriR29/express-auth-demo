const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.json({ message: "Success! You can not see this without a token" });
});

module.exports = router;
