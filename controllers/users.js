const User=require("../models/user.js");


module.exports.usersignup=(req,res)=>{
 res.render("users/signup.ejs");
};


module.exports.postsignup=async(req,res)=>{
    try{
        let {username,password,email}=req.body;
  let newUser= new User({
    email: email,
    username:username,
  });
  let data=await User.register(newUser,password);
      req.login(data,(err)=>{
        if(err){
          next(err);
        }
          req.flash("success","You signedup successfully ")
          res.redirect("/listings");
      });  
    } catch(err){
       req.flash("error",err.message);
       res.redirect("/signup");
    }
};


module.exports.loginup=(req,res)=>{
 res.render("users/login.ejs");
};


module.exports.Redirectpage=async(req,res)=>{
   
   if(res.locals.redirectURL){
          req.flash("success","Logged in successsfully"); 
          res.redirect(res.locals.redirectURL);
   }else{
    res.redirect("/listings");
   }   
  };


module.exports.LogoutPage=(req,res,next)=>{
 
  req.logout((err)=>{
         if(err){
    next(err);
  }else{
    req.flash("success","You logged out successfully");
    res.redirect("/listings");
  }
});
  };  