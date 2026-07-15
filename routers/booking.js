const express=require("express");
const { isAuth }=require("../midleweres/auth.js");
const { createBooking, cancleBooking, completeBooking, bookingPage } = require("../controllers/booking.js");

const router=express.Router()


router.post("/:id",isAuth,createBooking);

router.get("/complete/:bookingId",isAuth,completeBooking);


module.exports=router;

