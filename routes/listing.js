const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIN,belongsto,validate_error}=require("../middleware.js");
const { index_route } = require("../controllers/listing.js");
const listingfile=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingfile.index_route))
.post(isLoggedIN,upload.single("listing[image]"),validate_error,wrapAsync(listingfile.newpost));

//New Route

router.get("/new",isLoggedIN,listingfile.newroute);


router.route("/:id")
.get(wrapAsync(listingfile.showroute))
.put(isLoggedIN,belongsto,upload.single("listing[image]"),validate_error,wrapAsync(listingfile.postroute))
.delete(isLoggedIN,belongsto,wrapAsync(listingfile.deleteroute));



//Edit Route

router.get("/:id/edit",isLoggedIN,belongsto,wrapAsync(listingfile.editroute));



module.exports= router ;