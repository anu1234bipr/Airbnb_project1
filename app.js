
if(process.env.NODE_ENV !="production"){
   require('dotenv').config();
}
const express=require("express");
const MongoStore = require("connect-mongo");
const app=express();
const listings=require("./routes/listing.js");
app.use(express.urlencoded({ extended: true }));
const path=require("path");
const Listing=require("./models/listing.js");
const mongoose=require("mongoose");
const port=8080;
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");
const ExpressError=require("./utils/ExpressError.js");
const engine = require('ejs-mate');
const passport=require("passport");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"public")));
let methodOverride = require('method-override');
const { Session } = require("inspector/promises");
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const session = require('express-session');
const flash = require('connect-flash');
dbURL = process.env.Mongo_ATLAS;

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("ERROR",()=>{
console.log("Some error occured",err);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


main()
.then((res)=>{
    console.log("Database is connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.get("/",(req,res)=>{
   res.send("App is working well");
});

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);


app.all(/.*/,(req, res, next) => {
     next(new ExpressError(404,"Page not found!"));      
 });
app.use((err,req,res,next)=>{
   let {statusCode=500,message="Some error may occur"}=err;

   res.status(statusCode).render("listings/error.ejs",{err});
});
app.listen(port,()=>{
    console.log(`app is listening to port ${port}`);
});