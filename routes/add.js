const { Router } = require("express");
const Courses = require("../models/courses")
const auth = require("../middleware/auth")
const router = Router();
const {validationResult} = require("express-validator");
const { courseValidator } = require("../utils/validator");

router.get("/", auth, (req,res) => {
    res.render("add",{
        title : "Добавить курс",
        isAdd : true,
        courseErr : req.flash("courseErr"),
        data : {
            name : req.body.name,
            price : req.body.price,
            img : req.body.img
        }
    })
})

router.post("/", courseValidator ,auth, async (req,res) =>{
    const {name,price,img} = req.body


    const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(422).render("add",{
                title : "Добавить курс",
                isAdd : true,
                courseErr : errors.array()[0].msg,
                data : {
                    name : req.body.name,
                    price : req.body.price,
                    img : req.body.img
                }
            })
    }
    // const Course = new Courses(name,price,img);

    const courses = new Courses({
        title : name,
        price : price,
        img : img,
        userId : req.user
    })

    try {
        await courses.save()
        res.redirect("/courses")
    } catch (err) {
        console.log(err)
    }
})

module.exports = router