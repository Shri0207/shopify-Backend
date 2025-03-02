const mongoose = require('mongoose');
const { User } = require('./User');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true
    },
    brand:{
        type: String,
       
    },
    stock:{
        type: Number,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    User:{
        type: mongoose.Schema.ObjectId,
        ref: User,

    }
        
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };