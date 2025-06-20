const express = require ("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
const Listing = require ("../models/listing.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn,isOwner,validateListing }= require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { route } = require("./review.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router
.route("/")
//========Index  Route ==========
.get(wrapAsync(listingController.index)) 
//====Create Route =======
 .post(            
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
     wrapAsync(listingController.listingCreator)
         );


//========New route ======
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//===== Show Route========
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
   //=======Update Route=====
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.renderUpdateForm ))
  //=======Delete Route=======
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyForm));

//======= Edit Route =======
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router ;
