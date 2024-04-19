const express = require("express");

const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.route('/')
    .get(CategoryController.gellAllCategories)
    .post(CategoryController.createCategory)

router.route('/:id')
    .patch(CategoryController.updateCategory)
    .delete(CategoryController.deleteCategory);



module.exports = router;