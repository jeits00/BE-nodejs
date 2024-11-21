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