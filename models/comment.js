const mongoose = require("mongoose")
const {Schema} = mongoose

const commentSchema = new Schema({
    body: String,
    rating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'//ref here refers to the model name. use the attribute name when using populate() method
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment