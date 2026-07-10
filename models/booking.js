const { default: mongoose } = require("mongoose");

const bookingSchema=mongoose.Schema({
     userId:{
        type:mongoose.Schema.Types.ObjectId,
                ref:"user",
    },
     spotId:{
            type:mongoose.Schema.Types.ObjectId,
                    ref:"spot",
        },
        startTime:{
            type:Date,
            required:true,
        },
       
        endTime:{
            type:Date,
            required:true,
        },
         status:
        {
        type:String,
        enum:["BOOKED","ACTIVE", "COMPLETED","CANCELLED"],
        defult:"ACTIVE",
        },
        totalPrice:Number,

     createdAt:{
        type:Date,
     }
    
},{timestamps: true})

const bookingModel=mongoose.model("booking",bookingSchema);

module.exports=bookingModel;