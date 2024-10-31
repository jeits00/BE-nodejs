const ProductCategory = require("../../models/product-category.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {

   let find = {
    deleted: false,
   };

   const records = await ProductCategory.find(find);

   const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Add Product Category",
        records: newRecords
    });
};

// [GET] /admin/products-category/create - tạo mới sp
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);

    console.log(newRecords);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Add product category",
        records: newRecords
    });
};

// [POST] /admin/products-category/create - tạo mới sản phẩm
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id - chỉnh sửa sp
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
    
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Edit product category",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATCH] /admin/products-category/edit/:id - chỉnh sửa sp
module.exports.editPatch = async (req, res) => {
    const id = req.params;

    // Phần này in -> object rỗng : chưa tìm thấy lỗi
    // req.body.position = parseInt(req.body.position);
    // await ProductCategory.updateOne({ _id: id }, req.body);

    res.redirect("back");
};

// [GET] /admin/detail/:id - 
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id 
        };
    
        const records = await ProductCategory.findOne(find);
    
        res.render("admin/pages/products-category/detail", {
            pageTitle: records.title,
            records: records 
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};  

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {

    const id = req.params.id;
    console.log(id);

    // await ProductCategory.deleteOne({ _id: id });

    // res.redirect("back");
};