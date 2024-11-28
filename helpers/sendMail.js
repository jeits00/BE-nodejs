const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // tên gamil 
            pass: process.env.EMAIL_PASSWORD // mật khẩu sau khi đki 2 chiều của gg
        }
    });

    const mailOptions = {
        form: "",
        to: email,
        subject: subject,
        html: html 
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
            // do something useful
        }
    });
}