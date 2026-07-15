const bookingModel=require("../models/booking.js");
const redisClient = require("../config/redis");


module.exports.createBooking=async (req,res)=>{
    try {
        const {startTime, endTime } = req.body;
        const spotId = req.params.id;
        const today = new Date();

const [sh, sm] = startTime.split(":").map(Number);
const [eh, em] = endTime.split(":").map(Number);

const startDateTime = new Date();
startDateTime.setHours(sh, sm, 0, 0);

const endDateTime = new Date();
endDateTime.setHours(eh, em, 0, 0);

        const conflict = await bookingModel.findOne({
          spotId,
          status: { $ne: "CANCELLED" },
          startTime: { $lt: endDateTime },
          endTime: { $gt: startDateTime }
        });
    
        if (conflict) {
          return res.status(400).json({ message: "Time slot already booked" });
        }
    
        const booking = await bookingModel.create({
          spotId,
          userId: req.userId,
          startTime:startDateTime,
          endTime:endDateTime,
          status: "BOOKED"
        });
        await redisClient.del(
         "availableSpots"
        );
    
       return res.status(201).json({
    success: true,
    message: "Spot Booked"
});
      }
       catch (err) {
        console.log(err.massege);
        res.status(500).json({ error: err.message });
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