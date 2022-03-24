const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const User = require("../models/user.model");
const tokenSecretKey = require("crypto").randomBytes(32).toString("hex");

module.exports = {
    register: async (req, res)=>{
    
        try {
        const {firstName, lastName, DoB, gender, email, telephone, photo, password} = req.body;
        // Hash password and Salt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log({tokenSecretKey})
       
        

        // Create a new User
        const user = new User({
            firstName,
            lastName,
            email,
            DoB,
            gender,
            telephone,
            password: hashedPassword,
        })
        await user.save();

        if(!user) throw new Error("User not exist");
        return res.status(200).json({result: user});
    } catch (err) {
            res.status(400).json({message: err.message });
        
        }
    },
    login: async (req, res) =>{
        try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user) return res.status(404).send("User Not Found, Please Register");
        
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) return res.status(400).json({result: "Wrong Password"})

        // Token Secret key
        const tokenSecretKey = process.env.JWT_SECRET;
        // Data to be hashed
        const data = {_id: user._id };
        // Expiration of tokenSecretKey
        const tokenExpirationTime = process.env.JWT_EXPIRATION_TIME;

        // Create token
        const token = jwt.sign(data, tokenSecretKey, {
            expiresIn: tokenExpirationTime,
        })
        // console.log(token)
        return res.status(200).json({result: "Welcome to Leadway Assurance", token})
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    },
    reset_password: async (req, res) =>{
        

        try{
            const {userId, resetToken, password} = req.body;
            const user = await User.findById(userId)
            console.log(user)
            if (!user) return res.status(400).json({result: "User not Found"});
            
            const token = await Token.findOne({userId});
            if(!token) return res.status(400).json({result: "Token not found"})

            const isValid = await bcrypt.compare(resetToken, token.token);
            if(isValid) return res.status(400).json({result: "Token is not valid"})

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            await user.save();

            // token deletion
            token.remove();
             
            return res.status(200).json({result: "Password reset successfully!"})
        }catch (error) {
            return res.status(400).json({message: "error.message"})
        }
    }
    
}
