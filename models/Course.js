const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    level: { type: String, required: true, unique: true }, // "elementary", "intermediate"
    title: String,
    price: String,
    description: String,
    modalContent: [String], // Массив строк
    img: String, // URL или путь к иконке
    levelClass: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
