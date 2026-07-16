const bookingModel=require("../models/booking.js");
const redisClient = require("../config/redis");


module.exports.createBooking = async (req, res) => {

    const spotId = req.params.id;

    // Unique Redis key for this parking spot
    const lockKey = `lock:spot:${spotId}`;

    // Will store "OK" if the lock is acquired
    let locked = null;

    try {

        const { startTime, endTime } = req.body;

        // -----------------------------
        // Acquire Redis Lock
        // -----------------------------
        locked = await redisClient.set(
            lockKey,
            req.userId,
            {
                NX: true,
                EX: 10
            }
        );

        // Another user is already booking this spot
        if (!locked) {
            return res.status(409).json({
                success: false,
                message: "Another user is currently booking this parking spot. Please try again."
            });
        }

        // -----------------------------
        // Convert time strings to Date
        // -----------------------------
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);

        const startDateTime = new Date();
        startDateTime.setHours(sh, sm, 0, 0);

        const endDateTime = new Date();
        endDateTime.setHours(eh, em, 0, 0);

        // End time must be after start time
        if (startDateTime >= endDateTime) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time."
            });
        }

        // -----------------------------
        // Check booking conflict
        // -----------------------------
        const conflict = await bookingModel.findOne({
            spotId,
            status: { $ne: "CANCELLED" },
            startTime: { $lt: endDateTime },
            endTime: { $gt: startDateTime }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Time slot already booked."
            });
        }

        // -----------------------------
        // Create Booking
        // -----------------------------
        await bookingModel.create({
            spotId,
            userId: req.userId,
            startTime: startDateTime,
            endTime: endDateTime,
            status: "BOOKED"
        });

        // Clear cached parking data
        await redisClient.del("availableSpots");

        return res.status(201).json({
            success: true,
            message: "Spot Booked Successfully."
        });

    } catch (err) {

        console.log(err.message);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    } finally {

        // Release lock only if we acquired it
        if (locked) {
            await redisClient.del(lockKey);
        }

    }
};
 module.exports.completeBooking=async(req,res)=>{
  try{
     const { bookingId } = req.params;
        const booking =await bookingModel.findById(bookingId);
        if(!booking)
        {
           return res.status(404).json({
        message: "Booking not found"
      });
        }
        if(booking.userId!=req.userId)
        {
          return res.status(400).json({massege:"your not allow to complete the booking"});
        }
         if (booking.status === "COMPLETED") {
      return res.status(400).json({
        message: "Booking already completed"
      });
    }
      booking.status = "COMPLETED";
    await booking.save();
    await redisClient.del(
                 "availableSpots"
                );
      return res.status(200).json({
      message: "Booking completed successfully",
      booking
    });
  }
  
  catch(err){
 res.status(500).json({
      message: err.message
    });
  }
 }