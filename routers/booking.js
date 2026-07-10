const express=require("express");
const { isAuth }=require("../midleweres/auth.js");
const { createBooking, cancleBooking, completeBooking, bookingPage } = require("../controllers/booking.js");
const { getavelibleSpot } = require("../controllers/spot.js");

const router=express.Router()

router.get("/create/:id",isAuth,bookingPage);

router.post("/create/:id",isAuth,createBooking);

router.get("/cancel/:bookingId",isAuth,cancleBooking);

router.get("/complete/:bookingId",isAuth,completeBooking);


module.exports=router;

