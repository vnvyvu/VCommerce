const User = require('../../model/User');
const validator = require("express-validator");
module.exports = {
    registerRules: [
        /** Name field must be filled */
        validator.check("name", (value, {req})=>req.lang["{0}"]).notEmpty(),

        /** Email field must be filled with an email */
        validator.check("email", (value, {req})=>req.lang["{5}"]).isEmail(),
        /** Email is unique*/
        validator.check("email", (value, {req})=>req.lang["{1}"]).custom(async email=>{
            const invalid=await User.exists({email: email});
            if(invalid) return Promise.reject();
            else return Promise.resolve();
        }),

        /** Password check */
        validator.check("password", (value, {req})=>req.lang["{6}"]).isStrongPassword()
        //validator.check("password", (value, {req})=>req.lang["{6}"]).matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/gm)
    ], 

    registerValidate: (req, res, next)=>{
        const errors = validator.validationResult(req);
        if(errors.isEmpty()) next();
        else res.json(errors);
    }   
}