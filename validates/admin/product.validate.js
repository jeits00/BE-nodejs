// xử dụng middleware để xử lý nếu người dùng không nhập đúng yêu cầu khi thêm sp mới -> báo lỗi và ngược lại
module.exports.createPost = (req, res, next) => {
    if(!req.body.title) {
        req.flash("error!", `Vui lòng nhập tiêu đề!`);
        res.redirect("back");
        return;
    }

    next();
}