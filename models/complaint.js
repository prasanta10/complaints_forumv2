const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Comment = require("./comment")

const complaintSchema = Schema({
    title: String,
    score: Number,
    upvoteId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    downvoteId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    location: String,
    description: String,
    image: [{
        url: String,
        fileName: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment'
    }]
})

complaintSchema.post('findOneAndDelete', async (doc) => {
    if(doc)
    {
        await Comment.deleteMany({
            _id: {$in: doc.Comment}
        })
    }
})

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint