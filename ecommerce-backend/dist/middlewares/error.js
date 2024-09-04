export const errorMiddleware = ((err, req, res, next) => {
    err.message || (err.message = "Internal server error");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "castError")
        err.message = "Invalid Id";
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
});
//WRAPPER FUNCTION
export const tryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
