const categoryMiddleware = require("../../middlewares/client/category.middlewares");

const homeRoute = require("./home.route");
const productRoute = require("./product.route");

module.exports = (app) => {
    app.use( categoryMiddleware.category)

    app.use("/", homeRoute);

    app.use("/products", productRoute);
}