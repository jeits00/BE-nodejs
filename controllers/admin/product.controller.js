// Phần xử lý bên BE
const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

module.exports.index = async (req, res) => {
    
    // Tính năng bộ lọc 
    const filterStatus = filterStatusHelper(req.query);

    find = {
        deleted: false 
    };

    if(req.query.status) {
        find.status = req.query.status;
    }

    // Tính năng tìm kiếm 
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination: Tính năng phân trang
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    )
    // End Pagination 

    // Sort : chọn sắp xếp cho sản phẩm 
    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort

    const products = await Product.find(find)
        .sort({ price: "desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

    res.render("admin/pages/products/index", {
        pageTitle: "Product list page",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] admin/products/change-status/:status/:id - Tính năng thay đổi trạng thái 1sp
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Status update successful");

    res.redirect("back");
}

// [PATCH] admin/products/change-multi - logic submit nếu chọn chuyển nhiều sp thành Online/Off
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Status update successful of ${ids.length} products!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Status update successful of ${ids.length} products!`);
            break;
        case "detele-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    delete: true,
                    deleteAt: new Date()
                }
            );
            break;
        // Xử lý thay đổi vị trí của sp
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne(
                    { _id: id }, 
                    { position: position}
                );
            }
            break;
        default: 
            break;
    }

    res.redirect("back");
}

    // [PATCH] admin/products/delete/:id - tính năng xóa vĩnh viễn
    // module.exports.deleteItem = async (req, res) => {
    //     const id = req.params.id;

    //     await Product.deleteOne({ _id: id });

    //     res.redirect("back");
    // }

// [PATCH] admin/products/delete/:id - tính năng xóa sản phẩm
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deleteAt: new Date()
    });

    res.redirect("back");
}

// [GET] admin/products/create - tạo mới 1 sp
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add New Product"
    });
}

// [POST] admin/products/createPost - tạo mới sản phẩm
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] admin/products/edit - chỉnh sửa sp
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit Products",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }   
}

// [PATCH] /admin/products/edit/:id - Chỉnh sửa sp
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: id}, req.body);
        req.flash("success", `Cập nhập thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhập thất bại!`)
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }   
}