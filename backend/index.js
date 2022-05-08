const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const config = require("./config");
const log = require("./util/Logger");

require("./util/SanityChecks")();
const jwt_middleware = require("./auth/PassportInit")();

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const fileRoutes = require("./routes/FileRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const WishWedRoutes = require("./routes/WishWedRoutes");

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
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false, parameterLimit: 50000 }));

app.use(cookieParser(config.auth.cookie_secret));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/user", jwt_middleware, userRoutes);
app.use("/file", jwt_middleware, fileRoutes);
app.use("/category", jwt_middleware, categoryRoutes);
app.use("/wishwed", jwt_middleware, WishWedRoutes);

app.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => res.status(404).json({ error: "Not found." }));

app.listen(config.app.port, () => log.info(`Server started on port ${config.app.port}.`));

module.exports = app;
