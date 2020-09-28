const { Schema,model } = require("mongoose");

const options = {
    toObject : {
        virtuals : true
    },
    toJson : {
        virtuals : true
    }
}

const ordersSchema = new Schema({
    courses : [
        {
        course : {
            type: Object,
            required : true
        },
        count : {
            type : Number,
            required: true
        }
    }
    ],
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    date : {
        type : String
    }
},options)

module.exports = model("Orders",ordersSchema)