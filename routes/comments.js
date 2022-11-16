const express = require("express")
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const Complaints = require("../models/complaint");
const {isLoggedIn, /*validateComment,*/ isAuthor, isCommenter} = require("../middleware")
const comments = require("../controllers/comments")

router.post("/", isLoggedIn, /*validateComplaint,*/ catchAsync(comments.addComment))

//delete a comment
router.delete("/:reviewId", isLoggedIn, isCommenter, catchAsync(comments.deleteComment))


module.exports = router