const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const config = require("./config");
// const UserModel = require("./models/model");
// const CategorySchema = require("./models/Category_model")

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

require("./auth/passportutil");

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const fileRoutes = require("./routes/FileRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes); // authentication routes are not JWT protected
app.use("/user", passport.authenticate("jwt", { session: false }), userRoutes); // all user routes are JWT protected
app.use("/file", passport.authenticate("jwt", { session: false }), fileRoutes);
app.use("/category", passport.authenticate("jwt", { session: false }), categoryRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.error("Error caught");
  next(createError(404));
});

// Handle errors.
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(5000, () => {
  console.log("Server started.");
});
