const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true
    },
    image: {
        type: String
    }

})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;