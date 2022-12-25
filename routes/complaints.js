const express = require("express")
const router = express.Router({mergeParams: true})
const catchAsync = require("../utils/catchAsync")
const {isLoggedIn, isAuthor} = require("../middleware")
const complaints = require("../controllers/complaints");
const {storage} = require("../cloudinary/cloudinary")
const multer = require("multer")
const upload = multer({storage})

module.exports = router


router.route("/")
    .get(catchAsync(complaints.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(complaints.addComplaint))

router.get("/new", isLoggedIn, complaints.newComplaintForm)

router.route("/:id")
    .put(isLoggedIn, upload.array('image'), catchAsync(complaints.editComplaint))
    .get(catchAsync(complaints.showAComplaint))
    .delete(isLoggedIn, isAuthor, catchAsync(complaints.deleteComplaint))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(complaints.showEditPage))

router.put("/:id/up", isLoggedIn, catchAsync(complaints.upvote))
router.put("/:id/down", isLoggedIn, catchAsync(complaints.downvote))
router.put("/:id/report", isLoggedIn, catchAsync(complaints.report))

