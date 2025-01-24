require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

const PORT = process.env.PORT || 3500;

const db = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected"));

// Routes
const routes = require("./routes/main");

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/assets"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: db }),
  })
);

app.use("", routes);

app.get("*", async (req, res) => {
  res.status(400).render("404");
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
