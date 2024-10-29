const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false 
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Group Rights",
        records: records
    });
}

// [GET] /admin/roles/create 
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Create Group Right",
    });
}

// [POST] /admin/roles/create 
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false 
        };

        const data = await Role.findOne(find);

        console.log(data);

        res.render("admin/pages/roles/edit", {
            pageTitle: "Edit Group Right",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
    
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({ _id: id }, req.body);

        req.flash("success", "Cập nhập nhóm quyền thành công!");
    } catch (error) {
        req.flash("error", "Cập nhập nhóm quyền thất bại!");
    }

    res.redirect("back");
};