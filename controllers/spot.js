const redisClient = require("../config/redis");
const spotModel=require("../models/spot.js");

exports.createSpot = async (req, res) => {
    try {
        // 1. Get the data from the user's form
        const { area, landmark, pricePerHr } = req.body;
        const randomLatShift = (Math.random() - 0.5) * 0.1;
        const randomLngShift = (Math.random() - 0.5) * 0.1;

        // 2. MVP MODE: Save it directly to the database! 
        // We removed the map API completely. Every new spot gets a default pin.
        await spotModel.create({
            ownerId: req.userId,
            area: area,
            landmark: landmark,
            pricePerHr: pricePerHr,
            lat: 12.9716+randomLatShift, // Default pin (Center of Bangalore)
            lng: 77.5946+randomLngShift  // Default pin (Center of Bangalore)
        });
        await redisClient.del(
                 "availableSpots"
                );
        // 3. Send them back to the map page instantly
        
        return res.redirect("/user"); 
        
    } catch (err) {
        console.error("🔴 Error creating spot:", err);
        return res.status(500).send("Server Error: " + err.message);
    }
};


exports.Spots = (req, res) => {
  res.render("spotCreate.ejs")
};

exports.owerSpot=async(req,res)=>{
  try{
  const spots=await spotModel.find({ownerId:req.userId})
  res.status(201).json({spots})
  }
  catch(err){
    res.status(400).json("the error is: ",err)
  }
}

exports.update=async(req,res)=>{
  try
  {
  const {isActive}=req.body;
  const spot=await spotModel.findById(req.params.id)
  if(!spot)
  {
    return res.status(404).json({massege:"spot not found"})
  }
  if(spot.ownerId.toString() !==req.userId)
  {
    return res.status.json({massege:"you are not allow to update this spot"})
  }
  spot.isActive=isActive;
  await spot.save();

  return res.status(201).json({spot});
  }
  catch(err)
  {
    res.status(400).json("the error is:",err)
  }
}

exports.spotDelete=async(req,res)=>{
  try{
    const spot=await spotModel.findById(req.params.id)
     if(spot.ownerId.toString() !==req.userId)
  {
    return res.status.json({massege:"you are not allow to delete this spot"})
  }
   return res.status(201).json({spot});
  }
  catch(err)
  {
    res.status(400).json("the error is:",err)
  }
}

