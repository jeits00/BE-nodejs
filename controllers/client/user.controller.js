const md5 = require("md5");
const User = require("../../models/user.model");

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