const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validate_review,isLoggedIN,isexist,belongstoauthor}=require("../middleware.js");
const reviewsfile=require("../controllers/reviews.js");

//Review Route

router.post("/",isLoggedIN,validate_review,wrapAsync(reviewsfile.reviewroute));

//Delete Review Route

router.delete("/:reviewid",isLoggedIN,belongstoauthor,validate_review,wrapAsync(reviewsfile.deletereview));

module.exports= router ;