const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const reviewSchema = new Schema({
    comment: String ,
     rating :{
        type: Number ,
        min: 1 ,
        max: 5
             },
     createdAt: {
        type: Date,
        default: Date.now()
     },
     author: {
      type: Schema.Types.ObjectId,
      ref: "User",
     },
});

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;

// const del = async() =>{
//    let res= await Review.findByIdAndDelete('68381a175027249d83d25cf0');
//    console.log(res);
// } 
// del();