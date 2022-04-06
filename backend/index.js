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
app.use(cookieParser(config.auth.cookie_secret));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/user", jwt_middleware, userRoutes);
app.use("/file", jwt_middleware, fileRoutes);
app.use("/category", jwt_middleware, categoryRoutes);

app.get(["/", "/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const msg = {
//   to: 'aksharan@gmail.com', // Change to your recipient
//   from: 'MAWVolunteerHub@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

// sgMail
//   .send(msg)
//   .then((response) => {
//     console.log(response[0].statusCode)
//     console.log(response[0].headers)
//   })
//   .catch((error) => {
//     console.error(error)
//   })

app.listen(config.app.port, () => log.info(`Server started on port ${config.app.port}.`));

module.exports = app;
