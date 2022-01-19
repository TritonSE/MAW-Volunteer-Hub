const express = require("express")
const route = express.Router()
const {User} = require("./model")

route.patch("/User/:id/verify", (req,res)=>{
    try{
        User.findById(req.params.id).then((user) => {
            if (user.verified){
                res.send("User already approved")
            }else{
                Object.assign(user, {verified : true})
                user.save()
                res.send("User succesfully approved")
            }  
        })
    }catch{
        res.status(404).send({error: "user not found"})
    }
})


module.exports = route