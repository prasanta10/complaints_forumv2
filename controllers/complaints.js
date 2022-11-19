const Complaint = require("../models/complaint");
const {cloudinary} = require("../cloudinary/cloudinary.js")
const ExpressErrors  = require("../utils/ExpressErrors")

module.exports.index = async (req, res) => {
    const complaints = await Complaint.find({}).populate('image')
    res.render("complaints/index.ejs", { complaints })
}

module.exports.newComplaintForm = (req, res) => {
    res.render("complaints/new")
}

module.exports.addComplaint = async (req, res, next) => {
    const complaint = Complaint(req.body.complaint)
    complaint.user = req.user._id
    complaint.image = req.files.map(f => {return {url: f.path, fileName: f.filename}})
    console.log(complaint);
    await complaint.save()
    req.flash("success", "Added a Complaint")
    res.redirect(`/complaints/${complaint._id}`)
}

module.exports.showEditPage = async (req, res) => {
    const { id } = req.params;
    const complaint = await Complaint.findById(id).populate('image');
    if(!complaint)
    {
        req.flash('error', "Cannot not find the complaint you wished to edit")
        res.redirect('/complaints')
    }
    res.render("complaints/edit.ejs", { complaint })
}

module.exports.editComplaint = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const complaint = await Complaint.findByIdAndUpdate(id, req.body.complaint);
    const image = req.files.map(f => {return {url: f.path, fileName: f.filename}})
    camp.image.push(...image)
    await complaint.save();
    console.log(req.body.deleteImages)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { image: { fileName: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', "Edit Successful")
    res.redirect(`/complaints/${id}`)
}

module.exports.showAComplaint = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate(
            {
                path: 'comments',
                populate: {
                    path: 'user'
                }
            }
        )
        .populate('user')  
    if(!complaint)
    {
        req.flash('error', "Cannot not find that complaint")
        res.redirect('/complaints')
    }
    res.render("complaints/show.ejs", { complaint })
}

module.exports.deleteComplaint = async (req, res) => {
    const { id } = req.params;
    await Complaint.findByIdAndDelete(id)
    req.flash('success', 'Complaint deleted')
    res.redirect("/complaints")
}

module.exports.upvote = async(req, res) => {
    const {id} = req.params;
    const complaint = await Complaint.findById(id);
    console.log(complaint.upvoteId)
    if(complaint.downvoteId.includes(req.user._id) && !complaint.upvoteId.includes(req.user._id)){
        complaint.score += 2;
        let i = complaint.downvoteId.indexOf(req.user._id);
        complaint.downvoteId.splice(i, 1);
        complaint.upvoteId.push(req.user._id);
    }
    else if(!complaint.upvoteId.includes(req.user._id))
    {
        complaint.score += 1;
        complaint.upvoteId.push(req.user._id);
    }
    else
    {
        complaint.score -= 1;
        let i = complaint.upvoteId.indexOf(req.user._id);
        complaint.upvoteId.splice(i, 1);
    }
    await complaint.save();
    res.redirect(`/complaints/${id}`);

}
module.exports.downvote = async(req, res) => {
    const {id} = req.params;
    const complaint = await Complaint.findById(id);
    if(complaint.upvoteId.includes(req.user._id) && !complaint.downvoteId.includes(req.user._id)){
        complaint.score -= 2;
        let i = complaint.upvoteId.indexOf(req.user._id);
        complaint.upvoteId.splice(i, 1);
        complaint.downvoteId.push(req.user._id);
    }
    else if(!complaint.downvoteId.includes(req.user._id))
    {
        complaint.score -= 1;
        complaint.downvoteId.push(req.user._id);
    }
    else
    {
        complaint.score += 1;
        let i = complaint.downvoteId.indexOf(req.user._id);
        complaint.downvoteId.splice(i, 1);
    }
    await complaint.save();
    res.redirect(`/complaints/${id}`);
}