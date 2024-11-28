const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.route");

const generateHelpers = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/register 
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí tài khoản"
    });
};

// [POST] /user/register 
module.exports.registerPost = async (req, res) => {
    console.log(req.body);
    const existEmail = await User.findOne({
        email: req.body.email
    });

    // Check gmail có tồn tại hay chưa 
    if(existEmail) {
        req.flash("error", `Email đã tồn tại!`);
        res.redirect("back");
        return;
    }

    // mã hóa password 
    req.body.password = md5(req.body.password);

    // lưu lại thông tin tài khoản vào data  
    const user = new User(req.body);
    await user.save();

    // 
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

// [GET] /user/login 
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng kí tài khoản"
    });
};

// [POST] /user/login 
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // lấy data
    const user = await User.findOne({
        email: email,
        deleted: false 
    });

    // checked email 
    if(!user) {
        req.flash("error" `Email không tồn tại!`);
        res.redirect("back");
        return;
    }

    // checked password 
    if(md5(password) !== user.password) {
        req.flash("error", `Sai mật khẩu!`);
        res.redirect("back");
        return;
    } 

    // kiểm tra trạng thái của tài khoản 
    if(user.status === "inactive") {
        req.flash("error" `Tài khoản đang bị khóa!`);
        res.redirect("back");
        return;
    }

    // tạo cookie cho tài khoản 
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

// [GET] /user/logout 
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
};

// [GET] /user/register - lấy lại mật khẩu
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    });
};

// [GET] /user/register - Lấy lại mật khẩu, lấy mã otp lưu vào DB
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false 
    });

    if(!user) {
        req.flash("error", `Email không tồn tại!`);
        req.redirect("back");
        return;
    }

    // Lưu thông tin vào DB 
    const otp = generateHelpers.generateRandomNumber(8);  // Tạo mã otp 
    
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // Nếu tồn tại email thì gửi mã OTP qua email (viết sau)
    const subject = "Mật OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút.
    `;
    sendMailHelper.sendMail(email, subject, html);
    // End 

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp - Lấy mã otp 
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP", 
        email: email
    });
};

// [POST] /user/password/otp - Lấy mã otp và gửi lên post, kiểm tra  otp có hợp lệ hay không
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    // sau khi lấy đc email, otp ngta gửi lên 

    // Tìm xem trong DB có bản ghi nào có email, otp giống với ngta gửi lên không ! 
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    // Nếu không -> in ra thông báo lỗi 
    if(!result) {
        res.flash("error", `OTP không hợp lệ`);
        res.redirect("back");
        return;
    }

    // Đến bước này ta xác định người ta với email, otp ĐÚNG 
    // Nếu có -> 
    const user = await User.findOne({
        email: email
    });

    // ta sẽ lấy cái tokenUser trả cho người gửi để không sợ bị lộ 
    res.cookie("tokenUser", user.tokenUser);

    // redirect lại trang password 
    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset 
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu"
    });
};

// [POST] /user/password/reset - đổi lại mật khẩu
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    // update lại mật khẩu 
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });

    res.redirect("/");
};