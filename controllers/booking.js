const bookingModel=require("../models/booking.js");


module.exports.createBooking=async (req,res)=>{
    try {
        const { spotId, startTime, endTime } = req.body;
    
        const conflict = await bookingModel.findOne({
          spotId,
          status: { $ne: "CANCELLED" },
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        });
    
        if (conflict) {
          return res.status(400).json({ message: "Time slot already booked" });
        }
    
        const booking = await bookingModel.create({
          spotId,
          userId: req.userId,
          startTime,
          endTime,
          status: "BOOKED"
        });
    
        res.status(201).json(booking);
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
      message: "Booking ompleted successfully",
      booking
    });


  }
  
  catch(err){
 res.status(500).json({
      message: err.message
    });
  }
 }