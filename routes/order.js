const { Router } = require("express");
const Orders = require("../models/orders");
const auth = require("../middleware/auth");
const router = Router();


router.get("/", auth, async (req,res) => {
    const orders = await Orders.find().populate("user");
    const userId = await req.user._id
    let fixedOrders = await orders.map(elem => {
       elem = elem.toObject();
       elem.price = elem.courses.reduce((total,course) => {
            return total += course.count * course.course.price
            },0)
        return elem
    })

    fixedOrders = fixedOrders.filter(elem => {
        if(!elem.user){
            Orders.deleteOne({ _id :  elem._id})
            return false;
        }
        const orderId = elem.user._id;
        
        if ( userId.toString() === orderId.toString() ){
            return true
        }
        return false
    })



    res.render("order-list",{
        isOrderList : true,
        title : "Orders",
        orders : fixedOrders
    })
})

router.post("/", auth , async (req,res) => {
    const courses = await req.user.populate("cart.items.courseId").execPopulate()
    const newCourseOrder = [];

    courses.cart.items.map((course => {
        const {title,price,id} = course.courseId 
        newCourseOrder.push({
            count : course.count,
            course : {title,price,id}
        })
    }))

    const newOrder = new Orders({
        courses : newCourseOrder,
        user  : req.user,
        date : Intl.DateTimeFormat("en-US").format(Date.now())
    });

    req.user.cart = undefined;
    await req.user.save()
    await newOrder.save()

    res.redirect("/order")
})



module.exports = router