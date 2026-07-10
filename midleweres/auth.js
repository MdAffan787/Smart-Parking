const jwt=require("jsonwebtoken");

module.exports.isAuth=(req,res,next)=>{
    try{
        //const token=req.headers.authorization?.split(" ")[1];
        const token=req.cookies.token;
            if (!token) return res.status(401).redirect("/user/login");

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({message:err.message});
  }
    }