const Product = require("../../models/product_model");
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination");
const { prefixAdmin } = require("../../config/system");
// [GET] /admin/products

module.exports.product = async(req,res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status;
    }

    let objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limititems: 4
        },
        req.query,
        countProducts
    );

    const products =  await Product.find(find)
        .sort({position: "desc"})
        .limit(objectPagination.limititems)
        .skip(objectPagination.skip);
    res.render("admin/pages/product/index",{
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req,res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id},{status: status});
    req.flash("success", `Cập nhật trạng thái thành công!`);
    res.redirect(req.get('Referrer'));
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req,res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}},{status: "active"});
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            break
        case "inactive":
            await Product.updateMany({_id: {$in: ids}},{status: "inactive"});
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}},{deleted: true, deletedAt: new Date()});
            req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
            break;
        case "change-position":
            for(const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
                req.flash("success", `Đã đổi vị trí ${ids.length} sản phẩm thành công!`);
            }
            break;
        default:
            break;
    }
    res.redirect(req.get('Referrer'));
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req,res) => {
    const id = req.params.id;
    // await Product.deleteOne({_id: id});
    await Product.updateOne(
        {_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa sản phẩm thành công!`);
    res.redirect(req.get('Referrer'));
}

// [GET] /admin/products/create
module.exports.create = async(req,res) => {
    res.render("admin/pages/product/create",{
        pageTitle: "Thêm sản phẩm mới"
    });
}

// [POST] /admin/products/create
module.exports.createPost = async(req,res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position==""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const product = new Product(req.body);
    await product.save();
    req.flash("success", `Thêm sản phẩm mới thành công!`);
    res.redirect(prefixAdmin+"/products");
}

//[GET] /admin/products/edit/:id
module.exports.edit = async(req,res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id

        };
        const product = await Product.findOne(find);
        res.render("admin/pages/product/edit",{
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch(error){
        res.redirect(req.get('Referrer'));
    }
}

//[PATCH] /admin/products/editPatch/:id
module.exports.editPatch = async(req,res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    try{
        await Product.updateOne({_id: id},req.body)
        req.flash("success", `Chỉnh sửa sản phẩm thành công!`);
        res.redirect(req.get('Referrer'));
    } catch(error){
        res.redirect(req.get('Referrer'));
    }

}

//[GET] /admin/products/detail/:id
module.exports.detail = async(req,res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id

        };
        const product = await Product.findOne(find);
        res.render("admin/pages/product/detail",{
            pageTitle: product.title,
            product: product
        });
    } catch(error){
        res.redirect(req.get('Referrer'));
    }
}