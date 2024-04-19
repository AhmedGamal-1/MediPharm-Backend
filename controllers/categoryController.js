const CategoryModel = require("../models/category");

exports.gellAllCategories = async (req, res) => {
    try {
        const category = await CategoryModel.find();
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        return res.status(200).json({ success: true, data: category });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await CategoryModel.create(req.body);
        return res.status(201).json({ success: true, data: category });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CategoryModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        return res.status(200).json({ success: true, data: category });

    } catch (err) {
        err.message = "error updating category";
        next(err);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        return res.status(204).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
        err.message = "error deleting category";
        next(err);
    }
}