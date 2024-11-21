const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
    // checked xem ngta đăng nhập hay không - nếu đăng nhập thì sẽ thêm cái user
    if(req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active",
        }).select("-password");

        if(user) {
            res.locals.user = user;
        }
    }

    next();
}