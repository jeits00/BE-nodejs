const Account = require("../../models/account.model");
const md5 = require("md5");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role; 
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "List Account",
        records: records,
    });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false 
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Add New Account",
        roles: roles 
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    // code lọc gmail 
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false 
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect("back");
    } else {
        // mã hóa password
        req.body.password = md5(req.body.password);

        const records = new Account(req.body);
        await records.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};