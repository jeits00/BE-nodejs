const homeRoutes = require("./home.route");
const productsRoutes = require("./product.route");

module.exports = (app) => {
    app.use("/", homeRoutes);
    
    app.use("/products", productsRoutes);
}