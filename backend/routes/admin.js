const express = require("express")
const route = express.Router()
const {User} = require("./model")


//retrieves a list of the profiles of admin users 
route.get("/:admin", (req, res) => {
    User.find({admin:true}, 'profile').then((user)=>{
        res.json(user)
    })
});

//retrieves a list of the profiles of non admin users 
route.get("/:admin", (req, res) => {
    User.find({admin:false}, 'profile').then((user)=>{
        res.json(user)
    })
});

/*app.get("/admin/:admin", (req,res)=>{
    User.find({admin: req.params.admin}).then((user)=>{
        res.json(user)
    })
})*/



module.exports = route