const {
    Schema,
    model
} = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        reqired: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl : String,
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: "Courses",
                required: true,
            }
        }]
    }
})

userSchema.methods.addToCart = function (course) {
    const clonedItems = [...this.cart.items];
    const index = clonedItems.findIndex(elem => elem.courseId._id.toString() === course._id.toString());

    if (index !== -1) {
        clonedItems[index].count++
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        })
    }

    this.cart = {
        items: clonedItems
    };
    return this.save();
}

userSchema.methods.removeFromCart = function (id) {
    let newItems = [...this.cart.items];
    const index = newItems.findIndex(elem => elem.courseId.toString() === id.toString())

    if (newItems[index].count === 1) {
        newItems = [
            ...newItems.slice(0, index),
            ...newItems.slice(index + 1)
        ]
    } else {
        newItems[index].count--
    }

    this.cart = {
        items: newItems
    }
    return this.save()
}

userSchema.method("toClient", function () {
    const course = this.toObject();

    course.id = course._id
    delete course._id

    return course
})

module.exports = model("User", userSchema)