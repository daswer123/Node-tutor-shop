const {Router} = require("express");
const User = require("../models/user");
const Token = require("../models/token");
const uuid = require("uuid");
const {validationResult} = require("express-validator");
const { registerValidator, loginValidator, resetValidator } = require("../utils/validator")
const crypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../keys")
const emailOptions = require("../keys/email");
const router = Router();

const transport = nodemailer.createTransport(sendgrid({
    auth : {api_key : keys.EMAIL_API_KEY}
}))


router.get("/login",(req,res) =>{
    res.render("auth/login",{
        isLogin : true,
        title : "Authorization",
        logErr : req.flash("loginErr"),
        regErr : req.flash("registerErr"),
        resetSucc : req.flash("resetSucc")
    })
})

router.get("/logout",(req,res) =>{
    req.session.destroy(() => {
        res.redirect("/auth/login")
    })
})

router.post("/login", loginValidator, async(req,res) =>{
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash("loginErr", errors.array()[0].msg)
            return res.status(422).redirect("/auth/login#login")
        }

        const user = await User.findOne({ email : req.body.email})
        
        req.session.user = user;
        req.session.isAuth = true;
        req.session.save(err => {
            if (err) {throw err}
            res.redirect("/")
        })
    } catch(e){
        throw e
    }
})         
    // req.session.isAuth = true
    // const user = await User.findById("5f6d985fc123d91a00852dd9");
    // req.session.user = user;
    // req.session.save(err=> {
    //     if (err) throw err
    //     res.redirect("/")
    // })
// })

router.post("/register", registerValidator ,async (req,res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash("registerErr", errors.array()[0].msg)
            return res.status(422).redirect("/auth/login#register")
        }

        const {email, password,username} = req.body;

        const hashPassword = await crypt.hash(password,10)
        const user = new User({
            email,username,password : hashPassword, cart : {items : []}
        })

        await user.save()

        // await transport.sendMail(emailOptions.registration(email))

        req.session.user = user;
        req.session.isAuth = true;
        req.session.save(err => {
            if (err) {throw err}
            res.redirect("/")
            return
        })

    } catch (err){
        console.log(err)
    }
})

router.get("/reset",(req,res)=>{
    res.render("auth/reset",{
        title : "Fogot your pass?",
        resErr : req.flash("resetErr")
    })
})

router.post("/reset", resetValidator ,async (req,res)=>{

    try {
    const email = req.body.email;
    const userId = await User.findOne({ email });

    if (!userId){
        req.flash("resetErr","There is no these email, Try again!")
        return res.redirect("/auth/reset");
    }
    const tokenId = uuid.v4();

    const isTokenExists = await Token.findOne({ userId })
    
    if (isTokenExists){
        await Token.deleteOne({ userId })
    }

    const tokenHash = await crypt.hash(tokenId,10)

    const token = new Token({
        userId : userId,
        tokenId : tokenHash
    })

    await token.save()

    transport.sendMail(emailOptions.reset(userId.email,tokenId,userId._id))

    req.flash("resetSucc","Check your email we send a form")
    res.redirect("/auth/login");
    }
    catch(err) {
        console.log(err);
        throw err
    }
})

router.get("/resetpass", async (req,res) => {
    const tokenId = req.query.token;
    const userId = req.query.id;

    const token = await Token.findOne({ userId })

    if (token === null){
       return res.render("auth/login")
    }
    const isTokenRight = await crypt.compare(tokenId,token.tokenId);
    const isTokenNotExice = token.expires > Date.now()


    if (isTokenRight && isTokenNotExice){
        res.render("auth/resetpass",{
            userId : userId
        });
    } else {
        req.flash("loginErr","Token has been deleted, Try again")
       return res.redirect("/auth/login")
    }
    

    
})

router.post("/resetpass", resetValidator, async(req,res) => {
    const password = req.body.password
    const userId = req.body.userId

    const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash("loginErr", errors.array()[0].msg)
            return res.status(422).redirect("/auth/login#login")
    }

    const user = await User.findById(userId);

    await Token.findOneAndDelete({ userId })
    
    const newPass = await crypt.hash(password,10)

    await user.updateOne({password : newPass})

    req.flash("resetSucc", "Your password succssesfully be changed!")
    res.redirect("/auth/login")
})


module.exports = router