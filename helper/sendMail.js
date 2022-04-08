const nodemailer = require("nodemailer");
const ag = require("nodemailer-mailgun-transport");


module.exports = async (email, subject, message) => {
    try{
        const transporter = nodemailer.createTransport(
            ag({
                auth: {
                    api_key: process.env.MAIL_KEY,
                    domain: process.env.MAIL_DOMAIN
                },
            }),
        );

        const mailOptions = {
            from: "ibrahimkenny17@gmail.com",
            to: email,
            subject,
            html: message,
        };

        const isSent = transporter.sendMail(mailOptions, (err, info)=>{
            if (err) console.log({err});
            console.log("Message sent: %s", info);
            
        });
        console.log({isSent});
        return isSent;
    }catch(error){
        console.log({errorMail: error.message});
        return `${error}`;
    }
}

