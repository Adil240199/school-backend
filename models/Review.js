const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: String,
  location: String,
  text: String,
  img: String,
});

module.exports = mongoose.model("Review", reviewSchema);
