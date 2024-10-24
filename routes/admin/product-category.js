const express = require("express");
const multer  = require("multer");
const router = express.Router();

const upload = multer(); 


const controller = require("../../controllers/admin/product-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
)

module.exports = router;