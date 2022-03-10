const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const config = require("./config");
const log = require("./util/Logger");

require("./util/SanityChecks")();
require("./auth/passportutil");

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const fileRoutes = require("./routes/FileRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");

const rateLimiter = require("./middleware/RateLimiter");

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) => log.error(error));

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(rateLimiter);
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", authRoutes);
app.use("/user", passport.authenticate("jwt", { session: false }), userRoutes);
app.use("/file", passport.authenticate("jwt", { session: false }), fileRoutes);
app.use("/category", passport.authenticate("jwt", { session: false }), categoryRoutes);

app.use((req, res) => res.status(404).json({ error: "Error: Not found" }));

app.listen(config.app.port, () => log.info(`Server started on port ${config.app.port}.`));
