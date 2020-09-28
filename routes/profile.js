const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const auth = require("../middleware/auth")
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const { profileValidator } = require("../utils/validator");

router.get("/", auth ,async (req,res) => {
    const user = await req.user
    res.render("profile",{
        title: "Profile "+user.username,
        isProfile : true,
        profileErr : req.flash("profileErr"),
        user : user.toObject()
    })
})

router.post("/", auth , async (req,res) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()){
    //     req.flash("profileErr",errors.array()[0].msg)
    //     return res.status(422).redirect("/profile");
    // }
    const user = await User.findById(req.user._id);

    const toChange = {
        username : req.body.username
    }

    if (user.avatarUrl && req.file){
        await fs.unlink(user.avatarUrl, (err) => {
            if (err) throw err
        });
    }
    

    if(req.file){
        toChange.avatarUrl = req.file.path;
    }

    Object.assign(user, toChange)
    await user.save();
    res.redirect("/profile")
})

module.exports = router;