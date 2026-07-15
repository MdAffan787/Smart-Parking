const express=require("express");
const { isAuth }=require("../midleweres/auth.js")
const { createSpot,Spots, owerSpot ,spotDelete, update} = require("../controllers/spot");

const router=express.Router()

router.post("/",isAuth,createSpot)

router.get("/",isAuth,Spots)


router.get("/owner",isAuth,owerSpot)

router.patch("/:id",isAuth,update)




module.exports=router;