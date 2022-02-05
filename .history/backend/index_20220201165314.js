const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

// const UserModel = require("./models/model");

mongoose.connect("mongodb+srv://shreyagupta:Crue14furr@cluster0.cea9v.mongodb.net/Cluster0?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on("error", (error) => console.log(error));
mongoose.Promise = global.Promise;

require("./auth/passportutil");

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes); // authentication routes are not JWT protected
app.use("/user", passport.authenticate("jwt", { session: false }), userRoutes); // all user routes are JWT protected

// Handle errors.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(5000, () => {
  console.log("Server started.");
});
