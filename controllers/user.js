const userModel=require("../models/user.js")
const bcrypt=require("bcrypt");
const { genrateToken } = require("../utils/genrateToken.js");

module.exports.login=async (req,res)=>{

try{
    const {email,password}=req.body;
    const user=await userModel.find({
    email:email})
    if(!user)
    {
        return res.status(404).json({massege:"user not found"})
    }
bcrypt.compare(password,user.password,function(err, result){
    if(!result)
    {
        return res.status(404).json({massege:"incarrect password"})
    }
    const token=genrateToken(user)


    res.status(201).res.json({token});
})

}
catch(err)
{
    res.status(500).json({massege:"server err"});
}
}

module.exports.register=async(req,res)=>{
    try{
     const {name,email,password,phone}=req.body;
     const hash=bcrypt.hash(password, 10);
     const user=userModel.create({
        name,
        email,
        phone,
        password:hash,
     });
     console.log(user);
    return res.status(201).json({massege:"user created"});

    }
    catch(err)
    {
        return res.status(503).json({massege:"user is alredy exist"})
    }
}