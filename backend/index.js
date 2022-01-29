const express = require("express");
const cors = require("cors");
const FileRoutes = require("./routes/FileRoutes");

const app = express();
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use("/file", FileRoutes);

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res) => {
  res.send("Welcome to Express");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
