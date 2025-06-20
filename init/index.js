const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
 
main()
.then(()=>{
    console.log("Connect to MongoDB");
   

})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    // all owner have same object id 
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "683f2b8438f713329a9d4be7",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();