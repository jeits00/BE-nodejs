const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /cart/
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

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng", 
        cartDetail: cart
    });
}

// [POST] /cart/add/:productId - lấy id sp, số lượng sp, id giỏ hàng của người dùng vừa lấy lưu vào data
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    // lấy data có tên _id 
    const cart = await Cart.findOne({
        _id: cartId 
    });

    // kiểm tra xem id sp này đã có trong giỏ hàng chưa
    const existProductInCart = cart.products.find(item => item.product_id == productId);

    // Nếu sp đã có trong giỏ hàng thì +n thêm sp- nếu không sẽ thêm vào giỏ hàng
    if(existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;

        // update thêm lượng array trong object 
        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId 
            },
            {
                $set: 
                {
                    "products.$.quantity": quantityNew
                }
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity 
        };
    
        await Cart.updateOne(
            {
                _id: cartId 
            },
            {
                $push: { products: objectCart }
            }
        );
    
    }

    req.flash("Success", `Đã thêm sản phẩm vào giỏ hàng`);

    res.redirect("back");
}