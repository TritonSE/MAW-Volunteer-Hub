const express = require("express");

const route = express.Router();
const { UserModel } = require("../models/model");

route.get("/:admin", (req, res) => {
  UserModel.find({ admin: req.params.admin }, "profile").then((user) => {
    res.json(user);
  });
});

module.exports = route;
