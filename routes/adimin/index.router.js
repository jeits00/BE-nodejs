const systemConfig = require("../../config/system");

const dashboardRouters = require("./dashboard.router");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/admin/dashboard", dashboardRouters);
}