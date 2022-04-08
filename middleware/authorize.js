const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if(!header)return res.status(400).json({result: "Token is required"})
    // console.log({header})
    const token = header.split(" ")[1];
    // console.log(token)

    const userVerified = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(userVerified)
     req.user = userVerified
     next();
}