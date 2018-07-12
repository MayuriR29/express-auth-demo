// TODO handleasync error for all db operations
// TODO Fix bug where user cannot sign in after server restarts because this.salt is undefined
// TODO fix: DeprecationWarning: Custom inspection function on Objects via .inspect() is deprecated
// TODO: fix DeprecationWarning: collection.count is deprecated, and will be removed in a future version. Use collection.countDocuments or collection.estimatedDocumentCount instead
// TODO: get mongoose lab solutions from sahil

const express = require("express");
const { passport } = require("./config/passport");
const mongoose = require("mongoose");
const indexRouter = require("./routes/indexRouter");
const secretsRouter = require("./routes/secretsRouter");
const { handle400s, handle500 } = require("./middlewares/error_handlers");

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

app.use(handle400s);
app.use(handle500);

module.exports = app;
