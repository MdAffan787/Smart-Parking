const express=require("express");
const { createSpot, getSpots, owerSpot ,spotDelete, update} = require("../controllers/spot");

const router=express.Router()

router.post("/create",createSpot)
router.get("/",getSpots)

router.post("/:id",owerSpot)
router.patch("/:id",update)

router.delete("/:id",spotDelete)
module.exports=router;