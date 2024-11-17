const categoryMiddleware = require("../../middlewares/client/category.middlewares");

const homeRoute = require("./home.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");

module.exports = (app) => {
    app.use( categoryMiddleware.category)

    app.use("/", homeRoute);

    app.use("/products", productRoute);

    app.use("/search", searchRoute);
}