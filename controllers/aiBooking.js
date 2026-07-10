const { bookingSpot } = require("../services/geminiService");
const Spot = require("../models/spot");
const Booking = require("../models/booking");



module.exports.bookingAssistant = async (req, res) => {

    try {

        const { prompt } = req.body;

        const result = await bookingSpot(prompt);

        const booking = JSON.parse(result);
        const spot = await Spot.findOne({
    area: {
        $regex: booking.area,
        $options: "i"
    },
    isActive: true
});

if (!spot) {
    return res.json({
        success: false,
        message: "No parking spot available."
    });
}

const startDateTime = new Date(
    `${booking.date}T${booking.startTime}:00`
);

const endDateTime = new Date(
    `${booking.date}T${booking.endTime}:00`
);


const conflict = await Booking.findOne({

    spotId: spot._id,

    status: {
        $ne: "CANCELLED"
    },

    startTime: {
        $lt: endDateTime
    },

    endTime: {
        $gt: startDateTime
    }
});

    if (conflict)
    {
        return  res.json({

    success:false,

    message:"Time slot already booked."

});
    }
    const newBooking = await Booking.create({

    spotId: spot._id,

    userId: req.userId,

    startTime: startDateTime,

    endTime: endDateTime,

    status: "BOOKED"

});
const hours =
    (endDateTime - startDateTime) /
    (1000 * 60 * 60);

const totalPrice =
    hours * spot.pricePerHr;


    return res.json({

    success:true,

    booking:newBooking,

    parkingSpot:spot,

    totalPrice

});




    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

