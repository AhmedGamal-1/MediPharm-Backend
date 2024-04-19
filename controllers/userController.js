const User = require('./../models/user');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: users });

    } catch (err) {
        next(new AppError('Error getting users', 500));
    }

}


exports.updateMe = async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
    }

    try {
        const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, data: updatedUser });

    } catch (err) {
        next(new AppError('Error updating user', 500));
    }

}
