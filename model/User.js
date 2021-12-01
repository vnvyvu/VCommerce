const mongoose = require("mongoose");
const userScheme = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    }, 
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    }, 
    phone: {
        type: String, 
        trim: true,
        validate: {
            validator: ()=>this.phone.length>=9,
            message: v=> v+"{3}"
        }
    }, 
    hashedPassword: {
        type: String, 
        required: true, 
    }, 
    about: {
        type: String,
        trim: true, 
        default: "",
    }, 
    role: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
}, { timestamps: true });

/** Virtual */
const sha1 = require('sha1');
userScheme.virtual("password")
    .set(function(password){
        this._password = password;
        this.hashedPassword = sha1(password);
    })
    .get(function(){ return this._password; })

module.exports = mongoose.model("User", userScheme);