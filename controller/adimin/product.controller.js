// [GET] /admin/product
module.exports.index = (req, res) => {
    res.render("admin/pages/products/index", {
        pageTitle: "Danh Sach San Pham"
    });
}