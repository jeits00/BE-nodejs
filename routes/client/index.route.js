const categoryMiddleware = require("../../middlewares/client/category.middlewares");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);

    app.use("/", homeRoute);

    app.use("/products", productRoute);

    app.use("/search", searchRoute);

    app.use("/cart", cartRoute);

    app.use("/checkout", checkoutRoute);
}