const express=require("express");
const { register, login, userHome, logOut, getAvailableSpots ,history} = require("../controllers/user");
const { isAuth } = require("../midleweres/auth");

const router=express.Router()

router.post("/login",login)
router.get("/logout",logOut)


router.post("/register",register)
router.get("/booking-history",isAuth,history)


module.exports=router;