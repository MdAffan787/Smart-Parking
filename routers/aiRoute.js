const express=require("express");
const { searchParking } = require("../controllers/aiController");
const { bookingAssistant } = require("../controllers/aiBooking");




const router=express.Router();


router.post("/search",searchParking);
router.post("/book", bookingAssistant);




module.exports=router;