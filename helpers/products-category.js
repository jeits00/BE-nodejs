const ProductCategory = require("../models/product-category.model");

// lọc dữ liệu nếu có cùng id data cha 
module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false,
        });
    
        // sau khi tìm được data, mình sẽ tạo ra 1 biến để lấy data đó 
        let allSub = [...subs]; 
    
        // lấy ra những data, ta gọi getSubCategory (đệ quy) truyền lại id của danh mục hiện tại 
        // => đệ quy như vậy sẽ lấy ra những data con có id của data cha 
        // Lấy được các mảng của phần tử con, ta lại truyền vào biến đã tạo "allSub" 
        for (const sub of subs) {
            const childs = await getCategory(sub.id);
            allSub = allSub.concat(childs);
        }
    
        return allSub;
    }

    const result = await getCategory(parentId);
    return result;
}
// End dữ liệu nếu có cùng id data cha 