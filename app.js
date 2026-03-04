const express=require("express");
const app=express();
const cookieParser = require('cookie-parser')

app.use(cookieParser())

const userRouter=require("./routers/user.js")
const spotRouter=require("./routers/spot.js")
const bookingRouter=require("./routers/booking.js")


app.use("/user",userRouter);
app.use("/spot",spotRouter);
app.use("/booking",bookingRouter);

app.listen(3000, (req,res)=>{
console.log("its running");
})