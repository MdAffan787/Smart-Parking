const spotModel=require("../models/spot.js");

exports.createSpot = async (req, res) => {
  try {
    const { area, landmark, pricePerHr } = req.body;

    const spot = await spotModel.create({
      ownerId: req.userId,
      area,
      landmark,
      pricePerHr
    });

    res.status(201).json(spot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSpots = async (req, res) => {
  const spots = await Spot.find({ isActive: true });
  res.json(spots);
};

exports.owerSpot=async(req,res)=>{
  try{
  const spots=spotModel.find({ownerId:req.userId})
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
  const spot=spotModel.findById(req.params.id)
  if(!spot)
  {
    return res.status(404).json({massege:"spot not found"})
  }
  if(spot.ownerId.toString() !==req.userId)
  {
    return res.status.json({massege:"you are not allow to update this spot"})
  }
  spot.isActive=isActive;
  await booking.save();

  return res.status(201).json({spot});
  }
  catch(err)
  {
    res.status(400).json("the error is:",err)
  }
}

exports.spotDelete=async(req,res)=>{
  try{
    const spot=spotModel.findById(req.params.id)
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

exports.getavelibleSpot=async(req,res)=>{
  try{
     const { area, startTime, endTime } = req.query;
      if (!area || !startTime || !endTime) {
      return res.status(400).json({
        message: "area, startTime and endTime are required"
      });
    }
     const spots = await spotModel.find({
      area,
      isActive: true
    });

    if (spots.length === 0) {
      return res.json([]);
    }
const conflictingBookings = await bookingModel.find({
      spotId: { $in: spots.map(s => s._id) },
      status: { $ne: "CANCELLED" },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) }
    }).select("spotId");

    // 3️⃣ Exclude booked spots
    const bookedSpotIds = conflictingBookings.map(b => b.spotId.toString());

    const availableSpots = spots.filter(
      spot => !bookedSpotIds.includes(spot._id.toString())
    );

    res.json(availableSpots);


}
  catch(err){
  res.status(500).json({ error: err.message });
  }
}