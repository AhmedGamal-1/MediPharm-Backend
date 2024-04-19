const express = require('express');
const drugController = require('../controllers/drugController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, authController.restrictTo('admin', 'user'), drugController.getAllDrugs);
router.route('/:id').get(drugController.getDrugById).patch(drugController.updateDrug).delete(drugController.deleteDrug);
router.route('/category/:categoryId').get(drugController.getDrugsByCategory);

module.exports = router;