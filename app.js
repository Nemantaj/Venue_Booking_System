const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const MONGODB_URI = "mongodb://localhost:27017/booking";
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

app.use(userRoutes);
app.use(bookRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    app.listen(3001);
    console.log("Listening on port 3000!");
  })
  .catch((err) => {
    console.log(err);
  });
