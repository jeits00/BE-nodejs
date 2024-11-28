const User = require("../../models/user.model");

const systemConfig = require("../../config/system");

// Hàm kiểm tra xem người dùng có đăng nhập thông tin không?
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.tokenUser) {
        res.redirect(`/user/login`);
    } else {
        const user = await User.findOne({ tokenUser: req.cookies.token }).select("-password");

        if(!user) {
            res.redirect(`/user/login`);
        } else {
            res.locals.role = role;
            next();
        }
    }
};