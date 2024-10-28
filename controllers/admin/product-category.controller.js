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

    // đệ quy 
    // function createTree(arr, parentId = "") {
    //     const tree = [];
    //     arr.forEach((item) => {
    //         if (item.parent_id === parentId) {
    //             const newItem = item;
    //             const children = createTree(arr, item.id);
    //             if (children.length > 0) {
    //                 newItem.children = children;
    //             } 
    //             tree.push(newItem);
    //         }
    //     });
    //     return tree;
    // }

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
