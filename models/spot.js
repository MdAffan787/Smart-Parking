const { default: mongoose } = require("mongoose");

const spotSchema=mongoose.Schema({
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
                ref:"user",
    },
    area:{
            type:String,
            required:true,
           },
    landmark:{
            type:String,
            
           },
    pricePerHr:{
            type:Number,
           },
    isActive:{
        type:Boolean,
         default: true
    },
   createdAt:{
    type:Date,
    default:Date.now(),
   }
},{timestamps: true});

const spotModel=mongoose.model("spot",spotSchema);

module.exports=spotModel;