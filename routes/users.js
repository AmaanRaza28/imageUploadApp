const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect("/users/login");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.redirect("/images/myuploads");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/users/login");
});

module.exports = router;
