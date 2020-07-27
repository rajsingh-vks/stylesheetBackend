const express = require("express");
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const multer = require('multer');
//Route which should handle requests
const userRoutes = require('./api/routes/user');
const uploadclientRoutes = require('./api/routes/uploadclient');
//Route which should handle requests

//Connection with Mongoose
mongoose.connect(
    // "mongodb://localhost/styleseat",
    "/styleseat",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology:true
    },
    
    () => {
      console.log("Connect to Mongodb");
    }
);
//Connection with Mongoose

//Error Handling Header
// app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
//Error Handling Header

//Route Models which should handle requests
app.use("/user", userRoutes);
app.use("/uploadclient", uploadclientRoutes);
//Route Models  which should handle requests

//Middleware
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
});
//Middleware

module.exports = app;