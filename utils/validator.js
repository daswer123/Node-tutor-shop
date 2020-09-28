const { body } = require("express-validator");
const crypt = require("bcryptjs");
const User = require("../models/user");

exports.registerValidator = [
    body("email","Write right email please").isEmail().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({ email : value });

            if (user){
                return Promise.reject("These email already exists")
            }

            return true
        }
        catch (err) {
            console.log(err)
        }
    }).normalizeEmail({
        gmail_remove_dots : false,
        gmail_remove_subaddress: false,
        yahoo_remove_subaddress : false,
        icloud_remove_subaddress : false
    }),
    body("username","Name must contains at least 3 symbols").isLength({min : 3, max : 30}).trim(),
    body("password","Password must contains at least 6 letters and be latinic").isAlphanumeric().isLength({min : 6, max : 30}).trim(),
    body("confirm").custom((value , {req}) => {
        if (req.body.password !== value){
            throw new Error("Password must be equal")
        }
        return true
    }).trim()

    
]

exports.loginValidator = [
    body("email","Write right email please").isEmail().custom(async (value, {req}) => {
        try {
            const user = await User.findOne({ email : value });

            if (!user){
                return Promise.reject("These user doesn't exists")
            }

            return true
        }
        catch (err) {
            console.log(err)
        }
    }),

    body("password","Password must contains at least 6 letters and be latinic").isAlphanumeric().isLength({min : 6, max : 30}).trim().custom( async (value , {req}) => {
        const user = await User.findOne({email : req.body.email})
        const passTheSame = await crypt.compare(value,user.password);
        if (passTheSame){
            return true
        } else {
            return Promise.reject("Password isn't correct")
        }
    })

]

exports.resetValidator = [
    body("email","Email doesn't correct").isEmail().custom(async (value, {req} ) => {
        const user =  await User.findOne({ email : value});

        if (user){
            return true
        }
        return Promise.reject("These user don't exists")
    }),

    body("password","Password must contains at least 6 symbols").isAlphanumeric().isLength({min : 6, max: 30})
]

exports.courseValidator = [
    body("name","Name must be at least 3 symbols").isLength({min : 3, max: 20}).trim(),
    body("price","Price must be min 1$ max 10000$").isNumeric(),
    body("img","Type Correct URL").isURL()
]

exports.profileValidator = [
    body("username","Name must be at least 3 symbols").isLength({min : 3, max : 30}).trim()
]