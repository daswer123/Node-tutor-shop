const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth")
const Courses = require("../models/courses")

const mapCartItemsToNewArray = (cart) =>{
    return cart.items.map(elem => {
        return {
            ...elem.courseId._doc,
            id : elem.courseId._id,
            count : elem.count
        }
    })
}

const computePrice = (courses) =>{
    return courses.reduce((totalPrice,current)=>{
      return totalPrice += current.price * current.count
    },0)
}

router.post("/add", auth, async (req,res) =>{
    const course = await Courses.findById(req.body.id);
    await req.user.addToCart(course)
    res.redirect("/cart")
})

router.get("/", auth ,async (req,res) => {
    const userCart = await req.user
    .populate("cart.items.courseId")
    .execPopulate();
    const courses = mapCartItemsToNewArray(userCart.cart);

    res.render("cart",{
        title : "Cart",
        isCart : true,
        price : computePrice(courses),
        courses
    })
})

router.delete("/remove/:id", auth , async (req,res) =>{
   await req.user.removeFromCart(req.params.id);

   const cart = await req.user.populate("cart.items.courseId").execPopulate();

   const courses = mapCartItemsToNewArray(cart.cart);
   const newCart = {
       courses,
       price : computePrice(courses)
    }

    res.status(200).json(newCart);
})

module.exports = router