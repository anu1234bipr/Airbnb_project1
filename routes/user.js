const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {isexist}=require("../middleware.js");
const userfile=require("../controllers/users.js");
 

router.route("/signup")
.get(userfile.usersignup)
.post(isexist,wrapAsync(userfile.postsignup));


router.route("/login")
.get(userfile.loginup)
.post( isexist,passport.authenticate("local", { failureRedirect:"/login",failureFlash: true }),userfile.Redirectpage);

//Logout Route

router.get("/logout",userfile.LogoutPage);
  
module.exports=router;