import { tryCatch } from "../middlewares/error.js";
import { Product } from "../models/Product.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import {faker} from '@faker-js/faker'
//REVALIDATE ON NEW,UPDATE OR DELETE PRODUCT & NEW ORDER
export const getLatestProducts = tryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product"));
    }
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products
    });
});
//REVALIDATE ON NEW,UPDATE OR DELETE PRODUCT & NEW ORDER
export const getAllcategories = tryCatch(async (req, res, next) => {
    let catagories;
    if (myCache.has("categories")) {
        catagories = JSON.parse(myCache.get("categories"));
    }
    else {
        //we will use distinct when there is duplicate in array and do not want duplicate
        catagories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(catagories));
    }
    return res.status(200).json({
        success: true,
        catagories,
    });
});
export const getAdminProduct = tryCatch(async (req, res, next) => {
    let product;
    if (myCache.has("all-products")) {
        product = JSON.parse(myCache.get("all-products"));
    }
    else {
        product = await Product.find({});
        myCache.set("all-products", JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product
    });
});
export const getSingleProduct = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new errorHandler("Invalid product id", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product
    });
});
export const newProduct = tryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new errorHandler("please  add photo", 400));
    if (!name || !price || !stock || !category) {
        //giving path for deleting photo in uploads
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new errorHandler("please enter all the fields", 400));
    }
    await Product.create({
        name, price, stock, category: category.toLowerCase(), photo: photo?.path
    });
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "product created successfully"
    });
});
export const updateProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("Invalid product id", 404));
    if (photo) {
        //giving path for deleting photo in uploads
        rm(product.photo, () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: "product updated successfully"
    });
});
export const deleteProduct = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("product not found", 404));
    rm(product.photo, () => {
        console.log("photo deleted");
    });
    await Product.deleteOne();
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});
export const searchAllProduct = tryCatch(async (req, res, next) => {
    const { search, price, sort, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search, $options: "i"
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price)
        };
    if (category)
        baseQuery.category = category;
    const [products, filterProduct] = await Promise.all([Product.find(baseQuery).sort(sort && { price: sort === "asc" ? 1 : -1 }).limit(limit).skip(skip), Product.find(baseQuery)]);
    //    const product = await Product.find(baseQuery).sort(sort && {price:sort === "asc"? 1 : -1}).limit(limit).skip(skip)
    //    const filterProduct = await Product.find(baseQuery)
    const totalPage = Math.ceil(filterProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//       const products = [];
//       for (let i = 0; i < count; i++) {
//         const product = {
//           name: faker.commerce.productName(),
//           photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
//           price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//           stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//           category: faker.commerce.department(),
//           createdAt: new Date(faker.date.past()),
//           updatedAt: new Date(faker.date.recent()),
//           __v: 0,
//         };
//         products.push(product);
//       }
//       await Product.create(products);
//       console.log({ succecss: true });
//     };
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
