const mongoose = require('mongoose');

const productScheme = mongoose.Schema({
    name: {
        type: String, 
        trim: true, 
        require: true, 
    }, 
    description: {
        type: String, 
        trim: true, 
        default: ""
    },
    amount: {
        type: Number, 
        require: true, 
    },
    price: {
        type: Number, 
        require: true, 
    }, 
    sold: {
        type: Number, 
        default: 0,
    }, 
    images: {
        type: [String], 
    }, 
    shipping: {
        type: Boolean, 
        default: true, 
    }, 
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        require: true
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productScheme);