import { tryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reducestock } from "../utils/features.js";
import errorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const newOrder = tryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, total, shippingCharges, discount } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total || !shippingCharges || !discount)
        return next(new errorHandler("Please Enter All Fields", 400));
    const order = await Order.create({ shippingInfo, orderItems, user, subtotal, tax, total, shippingCharges, discount });
    await reducestock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true, userId: user,
        productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(200).json({
        success: true,
        message: 'order placed successfully'
    });
});
export const myOrders = tryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    const key = `my-orders${user}`;
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find({ user });
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
});
export const allOrders = tryCatch(async (req, res, next) => {
    const key = "all-orders";
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key));
    }
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
});
export const getSingleOrder = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (myCache.has(key))
        order = JSON.parse(myCache.get(key));
    else {
        order = await Order.findById(id).populate("user", "name");
        if (!order)
            return next(new errorHandler("Order Not Found", 404));
        myCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
});
export const processOrder = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new errorHandler("Order Not Found", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
        productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(200).json({
        success: true,
        message: "Order Processed Successfully",
    });
});
export const deleteOrder = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new errorHandler("Order Not Found", 404));
    await order.deleteOne();
    invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id)
    });
    return res.status(200).json({
        success: true,
        message: "Order Deleted Successfully",
    });
});
