const Review = require("../models/reviews.js");
const Listing=require("../models/listing.js");


module.exports.reviewroute=async (req,res)=>{

let listing=await Listing.findById(req.params.id);

let newReview=new Review(req.body.review);
newReview.author=req.user._id;
listing.reviews.push(newReview);

await newReview.save();
await listing.save(); 

req.flash("success"," Review Updated Successfully");
res.redirect(`/listings/${listing._id}`);
};



module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id ,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};