const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
const authMiddleware = require("../middleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/upload", authMiddleware, (req, res) => {
  res.render("upload");
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const userId = req.user.userId;
      const base64Image = req.file.buffer.toString("base64");
      const image = new Image({
        userId: userId,
        image: `data:${req.file.mimetype};base64,${base64Image}`,
        contentType: req.file.mimetype,
      });

      await image.save();
      res.redirect("/images/myuploads");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading image.");
    }
  }
);

router.get("/myuploads", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const images = await Image.find({ userId: userId });

    res.render("uploads", { images: images });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
