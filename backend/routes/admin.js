const express = require("express")
const route = express.Router()
const {User} = require("./model")


route.get("/:admin", (req, res) => {
    User.find({admin: req.params.admin}, 'profile').then((user)=>{
        res.json(user)
    })
});


module.exports = route