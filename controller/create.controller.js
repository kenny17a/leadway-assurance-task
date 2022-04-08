const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const User = require("../models/user.model");
// const tokenSecretKey = require("crypto").randomBytes(32).toString("hex");
const Token = require("../models/token.model")
const Mail = require("../helper/sendMail")


module.exports = {
    register: async (req, res)=>{
    
        try {
        const {firstName, lastName, DoB, gender, email, telephone, photo, password} = req.body;
        // Hash password and Salt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // console.log({tokenSecretKey})
       
         // Create a new User
        const user = await User.create({
            firstName,
            lastName,
            email,
            DoB,
            gender,
            telephone,
            password: hashedPassword,
        });
                // Token Secret key
                const tokenSecretKey = process.env.JWT_SECRET;
                // Data to be hashed
                const data = {_id: user._id };
                // Expiration of tokenSecretKey
                const tokenExpirationTime = process.env.JWT_EXPIRATION_TIME;
        
                //  Create token
                const token = jwt.sign(data, tokenSecretKey, {
                    expiresIn: tokenExpirationTime,
                });
                // console.log(token)
        
        if (!user) return res.status(400).json({result: "User Not Created"});
        return res.status(200).json({result: user, token});
    } catch (err) {
            return res.status(400).json({message: err.message });
        
        }
    },
    login: async (req, res) =>{
        try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
        return res.status(404).send("Email Not Found, Please Register");
        }
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) {
        return res.status(400).json({result: "Wrong Password"});
        }

         // Token Secret key
        const tokenSecretKey = process.env.JWT_SECRET;
        // Data to be hashed
        const data = {_id: user._id };
        // Expiration of tokenSecretKey
        const tokenExpirationTime = process.env.JWT_EXPIRATION_TIME;

        //  Create token
        const token = jwt.sign(data, tokenSecretKey, {
            expiresIn: tokenExpirationTime,
        });
        // console.log(token)
        return res.status(200).json({result: "Welcome to Leadway Assurance", token})
        } catch (err) {
            res.status(400).json({message: err.message})
        }
    },

    get: async (req, res) => {
        console.log(req.user._id)
        // const user = await User.find({});
        // To get specific Id from stored data
        const user = await User.find({_id: req.user._id});
         return res.status(200).json({data: user})
    },

    request_password_reset: async (req, res) =>{
        try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({reult: `Email Not found, try to register`});
        
        const resetToken = crypto.randomBytes(20).toString("hex")
        const hash = await bcrypt.hash(resetToken, 10);

         await Token.create({
            userId: user._id,
            token: hash
        })
        const url = `https://localhost:3000/reset_password/?userId=${user._id}&resetToken=${resetToken}`; 

        // Send Reset Password url to userId
        await Mail(
            email,
            "Reset Password",
            `<a href="${url}">Reset Password</a>`
        );
        return res.status(200).json({result: "Email"})

    } catch (error) {
        return res.status(400).json({message: error.message})

    }
    },
    reset_password: async (req, res) => {
        try{
            const{userId, resetToken, password} = req.body;
            
            const user = await User.findById(userId)
            if(!user) return res.status(404).json({result: "User Not Found"});
            
            const token = await Token.findOne({userId});
            if(!token) return res.status(404).json({result: "Token Not Found"});

            const isValid = await bcrypt.compare(resetToken, token.token)
            if(!isValid) return res.status(404).json({result: "Token Not Valid or Expired"})

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            user.password = hashPassword;
            await user.save();

            // Delete Token
            token.remove();

            return res.status(200).json({result: "Password Reset Successful"})

        }catch(error){
            return res.status(400).json({message: error.message})
        }

    }
}
