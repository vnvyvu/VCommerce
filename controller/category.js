const Category = require('../model/Category');
const vnRegEx = require('../language/vietnameseRegExp')
module.exports = {
    create: (req, res, next) => {
        const category = new Category(req.body);
        category.save()
            .then(data => res.json(data))
            .catch(err => next());
    }, 
    delete: (req, res, next) => {
        Category.deleteOne(req.category)
            .then((data) => res.json(data))
            .catch(err => next());
    }, 
    update: (req, res, next) => {
        Category.findByIdAndUpdate(req.category._id, req.body, {new: true})
            .then(data => res.json(data))
            .catch(err => next());
    },
    search: async (req, res, next) => {
        if(!!req.query.search){
            res.json(await Category.find({name: vnRegEx(req.query.search, "i")}));
        }else res.json(await Category.find().lean());
    }, 
    category: (req, res, next) => {
        res.json(req.category);
    }, 
    getCategory: async (req, res, next, id) => {
        req.category = await Category.findById(id);
        next();
    }
}