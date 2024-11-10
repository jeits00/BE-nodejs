const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET]
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false, 
        status: "active"
    }).limit(6);

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
    // End Lấy ra sản phẩm nổi bật

    // Hiển thị ra sản phẩm mới nhất 
    const productsNew = await Product.find({
        deleted: false, 
        status: "active"
    }).sort({ position: "desc" }).limit(6);

    console.log(newProducts)

    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    // End Hiển thị ra sản phẩm mới nhất    

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}