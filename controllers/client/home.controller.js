const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET]
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false, 
        status: "active"
    });

    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    // End Lấy ra sản phẩm nổi bật

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        productsFeatured: newProducts
    });
}