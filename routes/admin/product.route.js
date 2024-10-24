const express = require("express");
const multer  = require("multer");
const router = express.Router();
const storageMulter = require("../../helpers/storageMulter");

const upload = multer(); 

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    validate.createPost,
    controller.createPost
);

// tạo đường dẫn cho sửa sản phẩm 
router.get("/edit/:id", controller.edit);

// tạo đường dẫn cho sửa sản phẩm với phương thức PATCH
router.patch(
    "/edit/:id", 
    controller.editPatch,
    validate.createPost,
    controller.createPost
);

// Đường dẫn của chi tiết sản phẩm
router.get("/detail/:id", controller.detail);

module.exports = router;