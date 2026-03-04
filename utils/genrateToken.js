const jwt=require("jsonwebtoken");

module.exports.genrateToken=(user)=>{
    return jwt.sign({userId:user._id }, process.env.JWT_SECRET)
}