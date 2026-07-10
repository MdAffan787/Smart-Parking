const bookingModel=require("../models/booking.js");
const redisClient = require("../config/redis");

module.exports.bookingPage=(req,res)=>{
  try{
    res.render("bookingPage.ejs",{spotId:req.params.id});
  }
  catch(err){
    console.log("The error is",err.massege);
     res.status(500).json({ error: err.message });

  }
}
module.exports.createBooking=async (req,res)=>{
    try {
        const {startTime, endTime } = req.body;
        const spotId = req.params.id;
        const today = new Date().toISOString().split("T")[0];
        const startDateTime = new Date(`${today}T${startTime}`);
        const endDateTime = new Date(`${today}T${endTime}`);
    
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
    
       return res.redirect("/user"); 
      }
       catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
 module.exports.cancleBooking=async(req,res)=>{
  try{
        const { bookingId } = req.params;
        const booking =await bookingModel.findById(bookingId);
        if(!booking)
        {
           return res.status(404).json({
        message: "Booking not found"
      });
        }
            if (booking.status === "COMPLETED") {
      return res.status(400).json({
        message: "Booking already completed"
      });
    }

    booking.status = "CANCELLED";
    await booking.save();
      res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });

  }
  catch(err){
 res.status(500).json({
      message: err.message
    });
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
      res.status(200).json({
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