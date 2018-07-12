const express = require("express");
const jwt = require("jsonwebtoken");

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const users = [
  {
    id: 1,
    username: "jonathanmh",
    password: "%2yx4"
  },
  {
    id: 2,
    username: "test",
    password: "test"
  }
];

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "some_secret"
};

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log("payload received", jwt_payload);
  // usually this would be a database call:
  const user = users.find(user => user.id === jwt_payload.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());
app.use(express.json());

app.get("/", function(req, res) {
  res.json({ message: "Express is up!" });
});

app.post("/signin", function(req, res) {
  let username;
  let password;
  if (req.body.username && req.body.password) {
    username = req.body.username;
    password = req.body.password;
  }
  // usually this would be a database call:
  const user = users.find(user => user.username === username);
  console.log(user);
  if (!user) {
    res.status(401).json({ message: "no such user found" });
  }

  if (user.password === password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({ message: "ok", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

app.get("/secret", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  res.json({ message: "Success! You can not see this without a token" });
});

module.exports = app;
