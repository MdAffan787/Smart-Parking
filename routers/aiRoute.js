const express=require("express");
const { searchParking } = require("../controllers/aiController");
const { bookingAssistant } = require("../controllers/aiBooking");
const { isAuth } = require("../midleweres/auth");




const router=express.Router();


router.post("/search",isAuth,searchParking);
router.post("/book", bookingAssistant);




module.exports=router;