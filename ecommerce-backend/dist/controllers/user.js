import { User } from "../models/user.js";
import { tryCatch } from "../middlewares/error.js";
import errorHandler from "../utils/utility-class.js";
export const newUser = tryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    // when user login after signup
    let user = await User.findById(_id);
    if (user)
        return res.status(200).json({
            success: true,
            message: `welcome ${user.name}`
        });
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new errorHandler("Please add all fields", 400));
    user = await User.create({ name, email, photo, gender, _id, dob: new Date(dob) });
    res.status(200).json({
        success: true,
        message: `welcome ${user.name}`
    });
});
export const getAllUser = tryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});
export const getUser = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new errorHandler("Invalid Id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new errorHandler("Invalid Id", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
