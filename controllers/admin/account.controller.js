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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    try {
        const data = await Account.findOne(find);

        const roles = await Role.find({
            deleted: false,
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}

// [POST] /admin/accounts/edit/:id 
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        // tìm id khác với id đã thay đổi
        _id: { $ne: id }, // tìm trường id không bằng giá trị của biến id này, ne = not equal
        email: req.body.email,
        deleted: false 
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
    
        await Account.updateOne({ _id: id}, req.body);
    
        req.flash("success", `Cập nhập tài khoản thành công!`);
    }

    res.redirect("back");
};