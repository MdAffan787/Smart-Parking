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
  const spot=spotModel.findOneAndUpdate({._id:req.params.id},{isActive:isActive})
  return res.status(201).json({spot});
  }
  catch(err)
  {
    res.status(400).json("the error is:",err)
  }
}

exports.spotDelete=async(req,res)=>{
  try{
    const spot=spotModel.findOneAndDelete({._id:req.params.id})
    
   return res.status(201).json({spot});
  }
  catch(err)
  {
    res.status(400).json("the error is:",err)
  }
}