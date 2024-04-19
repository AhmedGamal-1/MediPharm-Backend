const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        index: true // Index the category field
    }
});


drugSchema.index({ name: 'text' })


// Validate the newPrice field
drugSchema.path('price').validate(function (value) {
    if (value < 0) {
        throw new Error('New price must be greater than or equal to 0');
    }
});

// Validate the productNameEn field
drugSchema.path('name').validate(function (value) {
    if (value.length > 100) {
        throw new Error('Product name must be less than or equal to 100 characters');
    }
});

// Validate the stockQuantity field
drugSchema.path('quantity').validate(function (value) {
    if (value < 0) {
        throw new Error('Stock quantity must be greater than or equal to 0');
    }
});


const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;