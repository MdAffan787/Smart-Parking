const express=require("express");
const { isAuth }=require("../midleweres/auth.js");
const { createBooking, cancleBooking, completeBooking } = require("../controllers/booking.js");
const { getavelibleSpot } = require("../controllers/spot.js");


router.post('/',getavelibleSpot)
router.post("/create",isAuth,createBooking);
router.get("/cancel/:bookingId",isAuth,cancleBooking);
router.get("/complete/:bookingId",isAuth,completeBooking);

const router=express.Router()

