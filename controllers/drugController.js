const Drug = require("./../models/drug");
const Category = require("./../models/category");
const AppError = require("../utils/appError");

const { spawn } = require("child_process");

exports.getAllDrugs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 30; // Number of products per page
    const query = req.query.q; // Search query

    const startIndex = (page - 1) * limit; // Calculate the starting index of products
    const endIndex = page * limit; // Calculate the ending index of products

    if (query) {
      const regex = new RegExp(query, "i"); // case-insensitive regex
      const drugs = await Drug.find({ name: { $regex: regex } })
        .skip(startIndex)
        .limit(limit)
        .exec();

      const count = await Drug.countDocuments({ name: { $regex: regex } });
      return res.status(200).json({
        success: true,
        results: drugs.length,
        totalCount: count,
        data: drugs,
      });
    }

    const totalDrugs = await Drug.countDocuments(); // Total number of products

    const drugs = await Drug.find().skip(startIndex).limit(limit);

    return res.status(200).json({
      success: true,
      count: drugs.length,
      totalDrugs,
      data: drugs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDrugById = async (req, res, next) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      return res
        .status(404)
        .json({ success: false, message: "Drug not found" });
    }
    return res.status(200).json({ success: true, data: drug });
  } catch (err) {
    next(new AppError("can't find this item", 404));
  }
};

exports.getDrugsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 30; // Number of products per page

    const startIndex = (page - 1) * limit; // Calculate the starting index of products
    const endIndex = page * limit; // Calculate the ending index of products

    const totalDrugs = await Drug.countDocuments({ categoryId });

    const drugs = await Drug.find({
      categoryId,
    })
      .skip(startIndex)
      .limit(limit);

    if (totalDrugs === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Drugs not found" });
    }

    return res.status(200).json({
      success: true,
      count: drugs.length,
      totalDrugs,
      data: drugs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.createDrug = async (req, res) => {
  try {
    const drug = await Drug.create(req.body);
    return res.status(201).json({ success: true, data: drug });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateDrug = async (req, res) => {
  try {
    const id = req.params.id;
    const drug = await Drug.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!drug) {
      return res
        .status(404)
        .json({ success: false, message: "Drug not found" });
    }
    return res.status(200).json({ success: true, data: drug });
  } catch (err) {
    // err.message = "error updating drug";
    next(new AppError(err.message, 404));
  }
};

exports.deleteDrug = async (req, res) => {
  try {
    const id = req.params.id;
    const drug = await Drug.findByIdAndDelete(id);
    if (!drug) {
      return res
        .status(404)
        .json({ success: false, message: "Drug not found" });
    }
    return res
      .status(204)
      .json({ success: true, message: "Drug deleted successfully" });
  } catch (err) {
    err.message = "error deleting drug";
    next(err);
  }
};

exports.searchByImage = async (req, res) => {
  const imagePath = req.body.imagePath;
  const pythonProcess = spawn("python", ["ocr.py", imagePath]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
        const extractedText = result.replace("Extracted text:", "").trim();
        const extractedTextList = extractedText.substring(1, extractedText.length - 1).split(", ");
        const formattedTextList = extractedTextList.map(text => text.replace(/'/g, ""));
        res.json({ result: formattedTextList });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while processing the data." });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python script: ${data.toString()}`);
  });
};
