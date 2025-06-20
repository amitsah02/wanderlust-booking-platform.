if(process.env.NODE_ENV  != "production"){
require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// const passportLocalMongoose = require('passport-local-mongoose');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust" ;
const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("Connect to MongoDB");
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));// update ke liye 
app.engine("ejs",ejsMate);// ejsMate ka engine use kiye 
app.use(express.static(path.join(__dirname,"/public")));//style set krnege public folder se 

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
});

//====== Express Session adding with cookies =====
 const secrectOptions = {
     secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookies:{
        expires : Date.now + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true 
    },
 };
 
app.use(session(secrectOptions));
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 //==== flash middleware +++++ 
app.use((req,res,next) =>{
    res.locals.success = req.flash("success") ;
     res.locals.error = req.flash("error") ;
     res.locals.currUser =req.user;
    
    next();
});

app.use("/demouser",async (req,res) =>{
let fakeUser = new User ({
    email:"student@gmail.com",
    username : "delta-student"
});

let registeredUser = await User.register(fakeUser, "helloworld");
res.send(registeredUser);
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
// let sampleListing = new Listing({
//     title: "My New Villa" ,
//     description:" By the beach",
//     price: 1200 ,
//     location : "calangute ,Goa",
//     country: "India"
// });
//  await sampleListing.save();
//     console.log("sample was Saved");
//     res.send("testing Successfully ");
// });


//========== all Error handler =========

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

//======async Error handler Middleware========
app.use((err,req,res,next) => {
    let {statusCode=500 , message ="Something Went Wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { statusCode, message });
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});