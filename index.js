require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const path = require("path");

const courseRoutes = require("./routes/courseRoutes");
const Review = require("./models/Review");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://school-raymea.vercel.app",
      "http://localhost:3001",
      "http://172.20.10.2:3001",
    ],
    methods: ["GET", "POST"],
  })
);
app.use(morgan("dev"));

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init(
    {
      fallbackLng: "ru",
      preload: ["en", "kz", "ru"],
      backend: {
        loadPath: path.join(__dirname, "locales/{{lng}}/translation.json"),
      },
    },
    (err) => {
      if (err) {
        console.error("i18next init failed:", err);
        process.exit(1);
      }

      app.use(middleware.handle(i18next));
      app.get("/api/reviews", async (req, res) => {
        try {
          const reviews = await Review.find().sort({ createdAt: -1 });
          res.json(reviews);
        } catch (err) {
          res.status(500).json({ error: "Server error" });
        }
      });

      app.post("/api/reviews", async (req, res) => {
        try {
          const newReview = new Review(req.body);
          await newReview.save();
          res.status(201).json(newReview);
        } catch (err) {
          res.status(400).json({ error: "Invalid review data" });
        }
      });

      app.use("/api", courseRoutes);

      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }
  );

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
