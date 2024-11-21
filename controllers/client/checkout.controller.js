const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    // bug: không có sp trong danh sách nên không cho vào trong giỏ, products không có dữ liệu -> lỗi

    const cartId = req.cookies.cartId;
    
    const cart = await Cart.find({
        _id: cartId 
    });

    console.log(cart.products);

    // có data sẽ có dùng cái if này.
    // if(cart.products.length > 0) {
    if(cart.products) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
            }).select("title thumbnail slug price discountPercentage");

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

            item.productInfo = productInfo;

            // tính giá 1sp 
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }

    // tổng tiền các sp 
    // lỗi data kh truy xuất đc nên lỗi 
    // cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    cart.totalPrice = 10;

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng" 
    });
}

// [POST] /checkout/order - lấy data của người thanh toán sản phẩm sau khi nhập: id, tên, sđt, ĐC, số lượng sp
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    // req.body chính bằng cái object bên dưới -> chỉ cần gán = req.body 
    // const userInfo = {
    //     fullName: String,
    //     phone: String,
    //     address: String 
    // };

    const cart = await Cart.findOne({
        _id: cartId 
    });

    const products = [];


    for (const product of cart.products) {
        // lấy dữ liệu array
        const objectProduct = 
        {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        // tìm ra sp đã có id giống với sp đã gửi lên 'product.product_id'
        // select -> truy xuất dữ liệu: price discountPercentage 
        const productInfo = await Product.findOne({
            _id: product.product_id 
        }).select("price discountPercentage");

        // cập nhập lại objectProduct với: price và discountPercentage
        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        // với mỗi vòng lặp sẽ gán dữ liệu vào products 
        products.push(objectProduct);
    }

    // tạo 1 object gán all các dữ liệu for trên. 
    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };

    // lưu lại dữ liệu mới vào data
    const order = new Order(orderInfo);
    order.save();

    // Cập nhập lại giỏ sau khi thanh toán thành công 
    await Cart.updateOne({
        _id: cartId 
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
}

// [POST] /checkout/order - Đây là trang 'đặt hàng thành công' 
// Sau khi KH nhập các thông tin -> chuyển sang trang đặt hàng thành công thì sẽ có các thông tin bên đó 
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId 
    });

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id 
        }).select("title thumbnail");
        // select: sẽ lấy các thông tin được yêu cầu - theo id trên.

        product.productInfo = productInfo;
        
        // tính giá mới
        product.priceNew = productsHelper.priceNewProduct(product);

        // tổng tiền của mỗi sản phẩm: giá mới * số lượng 
        product.totalPrice = product.priceNew * product.quantity;
    }

    // tổng tiền của cả đơn hàng 
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    console.log(order);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order 
    });
}