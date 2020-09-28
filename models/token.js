const {Schema,model} = require("mongoose");

const tokenSchema = new Schema( {
        tokenId : {
            type : String,
            required : true
        },
        userId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        expires : {
            type: Date,
            default : Date.now() + 60 * 60 * 1000 // +1 hours
            
    }
})

module.exports = model("Token",tokenSchema)