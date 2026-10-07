require("dotenv").config();

const express=require("express");
const app=express();

const cookieParser = require('cookie-parser')
const cors = require("cors");

require("./config/redis.js");

app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({extended : true}));
const db = require('./config/model.js');

const userRouter=require("./routers/user.js")
const spotRouter=require("./routers/spot.js")
const bookingRouter=require("./routers/booking.js")
const aiRouter=require("./routers/aiRoute.js")


app.use("/user",userRouter);
app.use("/spot",spotRouter);
app.use("/booking",bookingRouter);
app.use("/ai",aiRouter);


db.once("open", async () => {
  console.log("✅ MongoDB Connected!");
 
});


app.listen(3000, (req,res)=>{
console.log("its running 3000");
})