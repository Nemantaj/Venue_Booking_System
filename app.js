const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const MONGODB_URI = "Enter your mongoDb collection url";
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
   const status = error.statusCode; 
   res.status(status).json({ 
     title: error.title, 
     msg: error.message, 
   });
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
