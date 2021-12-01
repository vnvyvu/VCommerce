const User = require("../model/User");
const createError = require("http-errors");
module.exports = {
    profile: (req, res, next) => {
        res.json(req.user);
    }, 
    search: async (req, res, next) => {
        if(!!req.query.search.trim()) {
            res.json(await User.find({name: RegExp(req.query.search, "i")}, "-hashedPassword"));
        }else next(createError(404));
    }, 
    update: (req, res, next) => {
        if(req.body.password){
            req.body.hashedPassword = new User(req.body).hashedPassword;
        }
        User.findByIdAndUpdate(req.auth._id, req.body, {new: true})
        .then(data=>res.json(data)).catch(err=>next());
    }, 
    getUser: async (req, res, next, id) => {
        req.user = await User.findById(id, "-hashedPassword");
        next();
    }
}