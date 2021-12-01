const Product = require('../model/Product');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const createError = require('http-errors');
const vnRegEx = require('../language/vietnameseRegExp');
const baseDest = "./public/images/upload/";
const storage = multer.diskStorage({
    destination: baseDest,
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
module.exports = {
    create: (req, res, next) => {
        const product = new Product(req.body);
        product.images = req.files?req.files.map(f=>f.filename):[];
        product.save()
            .then((data) => res.json(data))
            .catch(err=>next());
    }, 
    delete: (req, res, next) => {
        req.product.delete()
            .then((data) => {
                for (const image of req.product.images) fs.unlinkSync(baseDest + image);
                res.json(data);
            })
            .catch(err=>next());
    },
    update: (req, res, next) => {
        if(req.files){
            req.body.images=req.product.images.concat(req.files.map(f=>f.filename));
        }
        Product.findByIdAndUpdate(req.product._id, req.body, {new: true}).then(data => res.json(data)).catch(err=>next());
    }, 
    search: async (req, res, next) => {
        if(!!req.query.search) {
            res.json(await Product.find({$or: [
                {name: vnRegEx(req.query.search, "i")}, 
                {description: vnRegEx(req.query.search, "i")}
            ]}).lean());
        }
        else res.json(await Product.find().limit(10).lean().catch(err=>next()));
    },
    product: (req, res, next)=>{
        res.json(req.product);
    },
    checkOwner: (req, res, next) => {
        if(!req.product) next(createError());
        else if(req.auth._id == req.product.user) next();
        else next(createError(403));
    }, 
    upload: multer({storage}).any(), 
    getProduct: async (req, res, next, id) => {
        req.product = await Product.findById(id);
        next();
    }, 

}