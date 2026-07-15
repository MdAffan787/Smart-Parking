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
res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
});

  return res.status(200).json({
    success: true,
    message: "Login successful",
});
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
     
    return res.status(201).json({
      success:"true",
      massege:"user created",

    });

    }
    catch(err)
    {
        res.status(503).json({massege:"user is alredy exist"})
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
module.exports.history = async (req, res) => {
    try {

        const history = await bookingModel
            .find({ userId: req.userId })
            .populate("spotId")
            .sort({ startTime: -1 });

        return res.status(200).json({
            success: true,
            history
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};