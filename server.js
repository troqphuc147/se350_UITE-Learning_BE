require('dotenv').config();
require('./services/passport');

const passport = require('passport');
const cookieSession = require('cookie-session');
const express = require("express");
var cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { PORT } = require("./constants");

global.__basedir = __dirname;

app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  // "mongodb+srv://admin:admin@uit-elearning.uqfe4.mongodb.net/sample?retryWrites=true&w=majority"
  process.env.DATABASE_URL
);
const db = mongoose.connection;

//mongoDB dependencies
require('./models/teacher') 
require('./models/quizz') 

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json())

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_TOKEN],
  })
);

app.use(passport.initialize());
app.use(passport.session());

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const route = require("./routes");
route(app);

app.listen(PORT, () => console.log("Server Started " + PORT));
