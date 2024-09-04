// Middleware makes sure that only admin is allowed
import { User } from "../models/user.js";
import errorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";
export const adminOnly = tryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new errorHandler("saale login kr phele", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new errorHandler("saale fake id banata h", 401));
    if (user.role !== "admin")
        return next(new errorHandler("saale aukaat nhi h tri", 401));
    next();
});
