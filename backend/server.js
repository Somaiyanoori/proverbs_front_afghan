import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";
import methodOverride from "method-override";

// Setup __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const dataPath = path.join(__dirname, "data/proverbs.json");

// Set EJS as view engine and static folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Create data folder and file if not exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
}
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]");
}

// Middleware for parsing JSON and urlencoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read proverbs from file
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};

// Write proverbs to file
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Home route: Show all proverbs on the home page
app.get("/", (req, res) => {
  const proverbs = readData();
  const categories = ["Wisdom", "Humor", "Life", "Culture"];
  const title = "Welcome to Afghan Proverbs";
  res.render("index", { title, categories, proverbs });
});

// Filtered proverbs route with optional category query
app.get("/proverbs", (req, res) => {
  const proverbs = readData();
  const categories = ["Wisdom", "Humor", "Life", "Culture"];
  const { category } = req.query;

  let filteredProverbs = proverbs;
  let title = "All Proverbs";

  if (category) {
    filteredProverbs = proverbs.filter((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      return cats.some((cat) => cat.toLowerCase() === category.toLowerCase());
    });
    title = `Proverbs - ${category}`;
  }

  res.render("index", {
    proverbs: filteredProverbs,
    categories,
    title,
  });
});

// API: Get all proverbs as JSON
app.get("/api/proverbs", (req, res) => {
  const proverbs = readData();
  res.json(proverbs);
});

// API: Get a specific proverb by ID
app.get("/proverbs/:id", (req, res) => {
  const id = req.params.id; // keep as string UUID
  const proverbs = readData();
  const foundProverb = proverbs.find((p) => p.id === id);
  if (foundProverb) {
    res.json(foundProverb);
  } else {
    res.status(404).json({ message: "Proverb not found by this ID." });
  }
});

// POST: Add a new proverb
app.post("/proverbs", (req, res) => {
  const { textDari, textPashto, translationEn, meaning, category } = req.body;

  if (!textDari || !textPashto || !translationEn || !meaning || !category) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  const proverbs = readData();

  const exists = proverbs.some(
    (p) =>
      p.textDari === textDari &&
      p.textPashto === textPashto &&
      p.translationEn === translationEn
  );

  if (exists) {
    return res.status(409).json({ message: "This proverb already exists." });
  }

  const newProverb = {
    id: crypto.randomUUID(), // string UUID
    textDari,
    textPashto,
    translationEn,
    meaning,
    category,
  };

  proverbs.push(newProverb);
  writeData(proverbs);
  res.status(201).json(newProverb);
});

// PUT: Update an existing proverb
app.put("/proverbs/:id", (req, res) => {
  const id = req.params.id; // keep as string UUID
  const updatedProverb = req.body;

  const proverbs = readData();
  const index = proverbs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Proverb not found." });
  }

  proverbs[index] = { ...proverbs[index], ...updatedProverb };

  writeData(proverbs);
  res.status(200).json(proverbs[index]);
});

// Route for contact page
app.get("/contact", (req, res) => {
  res.render("contact"); // renders views/contact.ejs
});

// DELETE: Delete a proverb by ID
app.delete("/proverbs/:id", (req, res) => {
  const id = Number(req.params.id);
  const proverbs = readData();

  const index = proverbs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Proverb not found." });
  }

  proverbs.splice(index, 1);
  writeData(proverbs);

  res.redirect("/proverbs");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
