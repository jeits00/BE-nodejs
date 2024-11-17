const Cart = require("../../models/cart.model");

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