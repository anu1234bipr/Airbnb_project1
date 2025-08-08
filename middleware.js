const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema,reviewSchema}=require("./Schema.js");
const Review=require("./models/reviews.js");



module.exports.isLoggedIN=(req,res,next)=>{
    //  console.log(req);
    if(!req.isAuthenticated()){
         req.session.redirectUrl=req.originalUrl;
        // res.redirectURL=req.originalUrl;
        req.flash("error","You must be logged in");
        res.redirect("/login");
    }else{
        next();
    }

}
module.exports.isexist=(req,res,next)=>{
    // console.log(req.session.redirectURL);
    if(req.session.redirectUrl){
        res.locals.redirectURL=req.session.redirectUrl;
    }
        next();
}

module.exports.belongsto=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(req.user._id.equals(listing.owner._id)){
      next();
    }else{
         req.flash("error","You are not owner of this post");
         res.redirect(`/listings/${id}`);
    }
}
module.exports.belongstoauthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review= await Review.findById(reviewid);
    // console.log(req.user._id);
    // console.log(review.author._id);
    if(!review.author.equals(res.locals.currUser._id)){
         req.flash("error","You are not author of this review");
         return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports. validate_error = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.validate_review=(req,res,next)=>{
let {err}=reviewSchema.validate(req.body);
  if(err){
    let errmsg=err.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,result.error);
  }
  else{
    next();
  }
}