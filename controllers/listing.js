const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index_route=async (req,res)=>{
  const lists=await Listing.find({});

 res.render('listings/index.ejs',{lists}); 
};

module.exports.newroute=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showroute=async(req,res)=>{
  let {id}=req.params;
  let list=await Listing.findById(id) .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("owner");
  if(!list){
    req.flash("error","Listing does not exist");
    res.redirect("/listings");
  }else{
  // console.log(list);
  res.render("listings/show.ejs",{list});}
};


module.exports.newpost=async (req,res)=>{
  let coord=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
  let url=req.file.path;
  let filename=req.file.filename;
  let newListing= new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=coord.body.features[0].geometry;
  await newListing.save();
  req.flash("success","New Listing Created");
  res.redirect("/listings");
};

module.exports.editroute=async (req,res)=>{
 
  let {id}=req.params;
  let list= await Listing.findById(id);
  if(!list){
    req.flash("error","Listing does not exist");
    res.redirect("/listings");
  }else{
  let listingurl=list.image.url;
  listingurl=listingurl.replace("/upload","/upload/w_250")  
  res.render("listings/edit.ejs",{list,listingurl});
  }
};

module.exports.postroute=async (req,res)=>{
 
   if(!req.body.listing){
    throw new ExpressError(400,"Enter valid data");
  }
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id ,{...req.body.listing});
  if(typeof req.file !="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success"," Listing Updated ");
  res.redirect("/listings");
};

module.exports.deleteroute=async(req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success"," Listing Deleted Successfully");
res.redirect("/listings");
};