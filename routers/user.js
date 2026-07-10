const express=require("express");
const { register, login, userHome, logOut, getAvailableSpots } = require("../controllers/user");

const router=express.Router()

router.get("/",userHome)

router.post("/login",login)


router.get("/login",(req,res)=>{
res.render("loginUser.ejs");
})


router.get("/logout",logOut)


router.post("/create",register)

router.get("/create",(req,res)=>{

res.render("createUser.ejs");

})
router.get("/api/spots", getAvailableSpots);


module.exports=router;