const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth");
const Courses = require("../models/courses");
const {validationResult} = require("express-validator");
const { courseValidator } = require("../utils/validator");

const hbsHelper = require("../utils/helperHbs")

function isOwner(req,course) {
    return req.user._id.toString() === course.userId.toString()
}

router.get("/", async (req,res) =>{
    const courses = await Courses.find()
    .populate("userId","email username")
    .select("userId price title img");

    const fixedCourses = courses.map(elem => elem.toObject())

    res.render("courses",{
        title : "Courses",
        isCourse : true,
        userId : req.user ? req.user._id.toString() : null, 
        helpers : hbsHelper,
        courses : fixedCourses        
    })
})

router.get("/:id/edit", auth , async (req,res) => {
    if(!req.query.allow){
        return res.redirect("/")
    }
    const course = await Courses.findById(req.params.id)

    if (!isOwner(req,course)){
        return res.redirect("/courses")
    }

    res.render("course-edit",{
        title : `Edit ${course.title}`,
        course : course.toObject(),
        courseErr : req.flash("courseErr")
    })
})

router.post("/remove", auth,async (req,res)=>{
    try {
        await Courses.deleteOne({ _id : req.body.id, userId : req.user._id })
        res.redirect("/courses")
    }
    catch(err){
        console.log(err)
    }
})

router.post("/edit", courseValidator , auth,async (req,res) => {
    const id = req.body.id;
    delete req.body.id;

    const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash("courseErr", errors.array()[0].msg)
            return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    const course = await Courses.findById(id);

    if (!isOwner(req,course)){
        return res.redirect("/courses")
    }

    await Courses.findByIdAndUpdate(id,req.body);
    res.redirect("/courses")
})

router.get("/:id",async (req,res) => {
    const course = await Courses.findById(req.params.id)
    .populate("userId","username")
    .select("title price img");

    res.render("course", {
        title : `Курс ${course.title}`,
        layout : "empty",
        course : course.toObject(),
        author : course.userId.username
    })
})

module.exports = router