// tính giá sản phẩm giá mới 
module.exports.priceNewProducts = (products) => {
    const newProducts = products.map((item) => {
        item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
        return item;
    });

    return newProducts;
}

// Giá sản phẩm cũ 
module.exports.priceNewProduct = (product) => {
    const priceNew = ((product.price * (100 - product.discountPercentage)) / 100).toFixed(0);

    return parseInt(priceNew);
}