const Product = require("../../models/product.model");

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] admin/products , lấy ra danh sách sản phẩm
module.exports.index = async (req, res) => {

    // bộ lọc
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    };

    if(req.query.status) {
        find.status = req.query.status ;  
    }

    // Search
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
        currentPage: 1,
        limitItems: 4
        },
        req.query,
        countProducts
    );
    // End Pagination

    const products = await Product.find(find)
        .sort({ position: "desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Product page ",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Status update successful");

    res.redirect("back");
}

// [PATCH] admin/products/change-multi 
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active"});
            req.flash("success", `Status update successful of ${ids.length} products!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive"});
            req.flash("success", `Status update successful of ${ids.length} products!`);
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } }, 
                {
                delete: true,
                deleteAt: new Date()
                }
            );
            break;
        // câu lệnh xử lý thay đổi vị trí của sản phẩm 
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne({ _id: id }, {
                    position: position
                });
            }
            break;
        default:
            break;            
    }

    res.redirect("back");
};

// [PATCH] admin/products/delete/:id - tính năng xóa sản phẩm
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
        deleted: true ,
        deleteAt: new Date()
    });

    res.redirect("back");
};

// [GET] admin/products/create , tạo ra 1 sản phẩm mới 
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add New Product ",
    });
};

// [GET] admin/products/createPost , tạo mới sản phẩm 
module.exports.createPost = async (req, res) => {
    console.log(req.file)
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        const countProducts = await Product.count();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.thumbnail = `/uploads/${req.file.filename}`;

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};