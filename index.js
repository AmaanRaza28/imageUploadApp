require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/users");
const imageRoutes = require("./routes/images");

mongoose
  .connect("mongodb://localhost:27017/image-upload-app")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

const app = express();
const port = process.env.PORT | 3000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/users", userRoutes);
app.use("/images", imageRoutes);

app.get("/", (req, res) => {
  res.redirect("/users/signup");
});
