// --- FIX: Explicitly specify the path to the .env file ---
// This ensures that dotenv finds and loads the variables correctly
// relative to where the app.js is located.
require('dotenv').config({ path: './.env' })

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const journalRoutes = require("./routes/journal-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use("/api/journal", journalRoutes); 
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB!"); // Added confirmation log
    app.listen(5005, () => {
      console.log("Server running on port 5005"); // Added confirmation log
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed!");
    console.log(err);
  });