import { tryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import errorHandler from "../utils/utility-class.js";
export const newcode = tryCatch(async (req, res, next) => {
    const { code, amount } = req.body;
    if (!code || !amount)
        return next(new errorHandler("please enter both the field", 400));
    const newcode = await Coupon.create({ code, amount });
    return res.status(200).json({
        success: true,
        message: `code ${newcode.code} created successfully`
    });
});
export const applyDsicount = tryCatch(async (req, res, next) => {
    const { code } = req.query;
    const matchCode = await Coupon.findOne({ code });
    if (!code)
        return next(new errorHandler("Invalid code", 400));
    return res.status(200).json({
        success: true,
        matchCode: matchCode?.code
    });
});
export const allCoupons = tryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons
    });
});
export const deleteCoupon = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    if (!id)
        return next(new errorHandler("please give id", 400));
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new errorHandler("invalid Id", 400));
    return res.status(200).json({
        success: true,
        message: "coupon deleted successfully"
    });
});
