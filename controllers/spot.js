const redisClient = require("../config/redis");
const bookingModel = require("../models/booking.js");
const spotModel=require("../models/spot.js");

exports.createSpot = async (req, res) => {
    try {
        // 1. Get the data from the user's form
        await redisClient.del("availableSpots");
        const { area, landmark, pricePerHr,lat,lng,isActive  } = req.body;
        const randomLatShift = (Math.random() - 0.5) * 0.1;
        const randomLngShift = (Math.random() - 0.5) * 0.1;

        // 2. MVP MODE: Save it directly to the database! 
        // We removed the map API completely. Every new spot gets a default pin.
        await spotModel.create({
            ownerId: req.userId,
            area: area,
            landmark: landmark,
            pricePerHr: pricePerHr,
            lat: lat||12.9716+randomLatShift, // Default pin (Center of Bangalore)
            lng: lng||77.5946+randomLngShift, // Default pin (Center of Bangalore)
            isActive:isActive
        });
        await redisClient.del(
                 "availableSpots"
                );
        // 3. Send them back to the map page instantly
        
        return res.status(201).json({
    success: true,
    message: "Spot Created"
}); 
        
    } catch (err) {
        console.error("🔴 Error creating spot:", err);
        return res.status(500).send("Server Error: " + err.message);
    }
};

exports.Spots = async (req, res) => {
    try {

        // 1. Check Redis
        const cached = await redisClient.get("availableSpots");

        if (cached) {
            console.log("✅ Data served from Redis");
            return res.json(JSON.parse(cached));
        }

        console.log("📦 Data served from MongoDB");

        const now = new Date();

        const spots = await spotModel.find({
            isActive: true
        });

        const result = [];

        for (const spot of spots) {

            const currentBooking = await bookingModel.findOne({
                spotId: spot._id,
                status: "BOOKED",
                startTime: { $lte: now },
                endTime: { $gte: now }
            });

            const nextBooking = await bookingModel.findOne({
                spotId: spot._id,
                status: "BOOKED",
                startTime: { $gt: now }
            }).sort({ startTime: 1 });

            result.push({
                _id: spot._id,
                area: spot.area,
                landmark: spot.landmark,
                pricePerHr: spot.pricePerHr,
                lat: spot.lat,
                lng: spot.lng,

                status: currentBooking ? "BOOKED" : "AVAILABLE",

                availableAfter: currentBooking
                    ? currentBooking.endTime
                    : null,

                nextBooking: nextBooking
                    ? nextBooking.startTime
                    : null
            });
        }

        // 2. Create response object
        const data = {
            success: true,
            spots: result
        };

        // 3. Save to Redis for 60 seconds
        await redisClient.set(
            "availableSpots",
            JSON.stringify(data),
            {
                EX: 60
            }
        );

        // 4. Return response
        return res.status(200).json(data);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.owerSpot=async(req,res)=>{
  try{
  const spots=await spotModel.find({ownerId:req.userId})
  return res.status(200).json({
    spots:spots,
    success:true})
  }
  catch(err){
    res.status(400).json("the error is: ",err)
  }
}



exports.update = async (req, res) => {
    try {

        const { isActive } = req.body;

        const spot = await spotModel.findById(req.params.id);

        if (!spot) {
            return res.status(404).json({
                success: false,
                message: "Spot not found"
            });
        }

        

        // Check ownership
        if (!spot.ownerId.equals(req.userId)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this spot"
            });
        }

        // Update status
        spot.isActive = isActive;

        await spot.save();

        // Clear cache
        await redisClient.del("availableSpots");

        return res.status(200).json({
            success: true,
            message: "Spot updated successfully",
            spot
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


