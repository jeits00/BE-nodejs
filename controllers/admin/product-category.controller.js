// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm"
    });
};

// [GET] /admin/products-category/create 
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo Danh mục sản phẩm"
    });
};