const express = require("express")
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const Complaints = require("../models/complaint");
const {isLoggedIn, isCommenter} = require("../middleware")
const comments = require("../controllers/comments")

router.post("/", isLoggedIn, catchAsync(comments.addComment))

router.delete("/:commentId", isLoggedIn, isCommenter, catchAsync(comments.deleteComment))


module.exports = router