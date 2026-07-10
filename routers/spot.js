const express=require("express");
const { isAuth }=require("../midleweres/auth.js")
const { createSpot,Spots, owerSpot ,spotDelete, update} = require("../controllers/spot");

const router=express.Router()

router.post("/",isAuth,createSpot)

router.get("/",Spots)


router.post("/:id",owerSpot)

router.patch("/:id",update)


router.delete("/:id",spotDelete)


module.exports=router;