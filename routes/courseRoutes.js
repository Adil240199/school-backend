// routes/courseRoutes.js
const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

router.get("/courses", async (req, res) => {
  try {
    const t = req.t; // функция перевода
    const raw = await Course.find() // берём все курсы из Mongo
      .sort({ level: 1 });

    // Собираем ответ: для каждого курса – дубль из БД + переводы
    const courses = raw.map((c) => {
      const lvl = c.level.toLowerCase();
      return {
        ...c.toObject(),
        title: t(`levelSelect.courses.${lvl}.title`),
        price: t(`levelSelect.courses.${lvl}.price`),
        description: t(`levelSelect.courses.${lvl}.description`),
        modalTitle: t(`levelSelect.modals.${lvl}.title`),
        modalContent: t(`levelSelect.modals.${lvl}.content`, {
          returnObjects: true,
        }),
      };
    });

    return res.json({
      title: t("levelSelect.title"),
      courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// Создать курс
router.post("/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Обновить курс
router.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Удалить курс
router.delete("/courses/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
