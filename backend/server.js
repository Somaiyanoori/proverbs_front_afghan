import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from "method-override";

// Setup __dirname and __filename
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

// Filtered proverbs route with optional category
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

// PUT: Update an existing proverb
app.put("/proverbs/:id", (req, res) => {
  const id = Number(req.params.id);

  const proverbs = readData();
  const index = proverbs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Proverb not found." });
  }

  proverbs[index] = { ...proverbs[index], ...updatedProverb, id };

  writeData(proverbs);
  res.status(200).json(proverbs[index]);
});

// Route for contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});

// DELETE: Delete a proverb by ID
app.delete("/proverbs/:id", (req, res) => {
  const id = Number(req.params.id); // تبدیل رشته به عدد
  const proverbs = readData();

  const index = proverbs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Proverb not found." });
  }

  proverbs.splice(index, 1);
  writeData(proverbs);

  res.redirect("/proverbs");
});

// POST: Add a new proverb with numeric incremental id
app.post("/proverbs", (req, res) => {
  const proverbs = readData();
  const maxId = proverbs.reduce((max, p) => (p.id > max ? p.id : max), 0);

  const newProverb = {
    id: maxId + 1,
    textDari: req.body.textDari,
    textPashto: req.body.textPashto,
    translationEn: req.body.translationEn,
    meaning: req.body.meaning,
    category: req.body.category,
  };

  proverbs.push(newProverb);
  writeData(proverbs);

  res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
