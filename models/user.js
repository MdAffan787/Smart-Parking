const { default: mongoose } = require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
     password:{
        type:String,
        required:true,
        

     },
     createdAt:{
        type:String,
     }
    
},{timestamps: true})

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;