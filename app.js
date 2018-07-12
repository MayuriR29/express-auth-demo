const express = require("express");
const { passport } = require("./config/passport");
const mongoose = require("mongoose");
const indexRouter = require("./routes/indexRouter");
const secretsRouter = require("./routes/secretsRouter");
const { handle404, handle500 } = require("./middlewares/error_handlers");

mongoose.connect(
  "mongodb://localhost:27017/express-authentication-lab-2",
  { useNewUrlParser: true }
);

// mongoose.connection.dropCollection("users"); // uncomment this to remove all users from db

const app = express();
app.use(passport.initialize());
app.use(express.json());

app.use("/", indexRouter);
app.use(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  secretsRouter
);

app.use(handle404);
app.use(handle500);

module.exports = app;
