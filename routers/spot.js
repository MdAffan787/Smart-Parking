const express=require("express");
const { isAuth }=require("../midleweres/auth.js")
const { createSpot, getSpots, owerSpot ,spotDelete, update} = require("../controllers/spot");

const router=express.Router()

router.post("/create",isAuth,createSpot)
router.get("/",getSpots)

router.post("/:id",owerSpot)
router.patch("/:id",update)

router.delete("/:id",spotDelete)
module.exports=router;