const mongoose=require("mongoose");
MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("../models/listing.js");
require('dotenv').config();
const initData=require("./data.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


main()
.then((res)=>{
    console.log("Database is connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB= async ()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({...obj,owner:'687de087f9225dd9ac51fdfc'}));
  //  console.log(initData.data);
  for(let dta of initData.data){
     let coord=await geocodingClient.forwardGeocode({
  query: dta.location,
  limit: 1
})
  .send()
   dta.geometry=coord.body.features[0].geometry;
  }
 
   await Listing.insertMany(initData.data);
   await console.log("Data was initialized");
}
initDB();
// console.log(Listing.find());
