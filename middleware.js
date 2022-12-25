const ExpressErrors = require("./utils/ExpressErrors")
const Complaint = require("./models/complaint")
const Comment = require("./models/comment")
const User = require("./models/user")

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in first')
        return res.redirect('/')
    }
    next()
}

module.exports.validateComplaint = (req, res, next) => {
    //for joi validation
    const { error } = campSchema.validate(req.body)
    if (error) {
        throw new ExpressErrors(error.details.map(el => el.message).join(","), 400)
    }
    else{
        next()
    }
}

module.exports.validateComplaint = (req, res, next) => {
    //for joi validation
    console.log(req.body)
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        throw new ExpressErrors(error.details.map(el => el.message).join(","), 400)
    }
    else{
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params
    const complaint = await Complaint.findById(id)
    const user = await User.findOne({googleID: req.user.id})
    if(!complaint.user.equals(user._id))
    {
        req.flash('error', 'You are not authorised to do that!! >:(')
        return res.redirect(`/complaints/${id}`)
    }
    next()
}

module.exports.isCommenter = async (req, res, next) => {
    const {id, commentId} = req.params
    const comment = await Comment.findById(commentId)
    const user = await User.findOne({googleID: req.user.id})
    console.log(user)
    console.log(comment.user)
    if(!comment.user.equals(user._id))
    {
        req.flash('error', 'You are not authorised to do that!! >:(')
        return res.redirect(`/complaints/${id}`)
    }
    next()
}
