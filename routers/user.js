const express=require("express");
const { register, login, logOut ,history} = require("../controllers/user");
const { isAuth } = require("../midleweres/auth");

const router=express.Router()

router.post("/login",login)
router.get("/logout",isAuth,logOut)


router.post("/register",register)
router.get("/booking-history",isAuth,history)


module.exports=router;