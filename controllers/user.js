const userModel=require("../models/user.js")
const bcrypt=require("bcrypt");
const { genrateToken } = require("../utils/genrateToken.js");
const bookingModel = require("../models/booking.js");
const spotModel = require("../models/spot.js");
const redisClient = require("../config/redis.js");

module.exports.login=async (req,res)=>{

try{
    const {email,password}=req.body;
    const user=await userModel.findOne({
    email:email})
   
    if(!user)
    {
        return res.status(404).json({massege:"user not found"})
    }
bcrypt.compare(password,user.password,function(err, result){
    if(!result)
    {
        return res.status(404).json({massege:"incarrect password"})
    }
    const token=genrateToken(user)
res.cookie("token", token);

   return res.status(201).json({token});
})

}
catch(err)
{
    res.status(500).json({massege:"server err"});
}
}
module.exports.logOut=async(req,res)=>{
  
    // 1. Completely delete the token cookie from the user's browser
    res.clearCookie("token");
    return;

}
module.exports.register=async(req,res)=>{
    try{
     const {name,email,password,phone}=req.body;
     const hash=await bcrypt.hash(password, 10);
     const user=await userModel.create({
        name,
        email,
        phone,
        password:hash,
     });
       const token=genrateToken(user)
res.cookie("token", token);
     
    return res.status(201).json({massege:"user created"});

    }
    catch(err)
    {
        return res.status(503).json({massege:"user is alredy exist"})
    }
}

async function updatebooking()
{
  const now=Date.now();
  const result=await bookingModel.updateMany(
        {
            status: "BOOKED",
            endTime: { $lte: now }
        },
        {
            $set: { status: "COMPLETED" }
        }
    );
    if (result.modifiedCount > 0) {
        await redisClient.del("availableSpots");
       
    }
}


module.exports.userHome = async (req, res) => {
  try {
    await updatebooking();

    const cache = await redisClient.get("availableSpots");

    if(cache){

      console.log("⚡ Data from Redis");

      return res.render(
        "userspot.ejs",
        {
          spots: JSON.parse(cache)
        }
      );
    }

    console.log("📦 Data from MongoDB");

    const activeBookings =
      await bookingModel.find({
        status: {
          $in:["BOOKED","ACTIVE"]
        }
      });

    const bookedSpotIds =
      activeBookings.map(
        booking => booking.spotId
      );

    const availableSpots =
      await spotModel.find({
        isActive:true,
        _id:{
          $nin:bookedSpotIds
        }
      });

    await redisClient.set(
      "availableSpots",

      JSON.stringify(
        availableSpots
      ),

      {
        EX:60
      }
    );

    res.render(
      "userspot.ejs",
      {
        spots:availableSpots
      }
    );

  }
  catch(err){

    console.log(
      "🔴 ERROR",
      err
    );

    return res
      .status(500)
      .send(err.message);

  }
}

module.exports.getAvailableSpots = async (req, res) => {
    try {
        const activeBookings = await bookingModel.find({
            status: { $in: ["BOOKED", "ACTIVE"] }
        });

        const bookedSpotIds = activeBookings.map(
            booking => booking.spotId
        );

        const availableSpots = await spotModel.find({
            isActive: true,
            _id: { $nin: bookedSpotIds }
        });

        res.status(200).json({
            success: true,
            spots: availableSpots
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};