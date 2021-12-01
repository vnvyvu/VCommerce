const User = require('../../model/User');
const validator = require('express-validator');
module.exports = {
    updationRules: [
        /** If email field is filled then check isEmail */
        validator.check("email", (value, {req})=>req.lang["{5}"]).if(validator.check("email").exists()).isEmail(),
        /** If email field is filled then check uniqueEmail*/
        validator.check("email", (value, {req})=>req.lang["{1}"]).if(validator.check("email").exists()).custom(async email=>{
            const invalid=await User.exists({email: email});
            if(invalid) return Promise.reject();
            else return Promise.resolve();
        }),

        /** If password field is filled then check strongPassword*/
        validator.check("password", (value, {req})=>req.lang["{6}"]).if(validator.check("password").exists()).isStrongPassword()
    ], 
    updationValidate: (req, res, next) => {
        const errors = validator.validationResult(req);
        if(errors.isEmpty()) next();
        else res.json(errors);
    }
}