import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import { deleteProduct, getAdminProduct, getAllcategories, getLatestProducts, getSingleProduct, newProduct, searchAllProduct, updateProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post('/new',singleUpload,newProduct)

app.get('/latest',getLatestProducts)

app.get('/all',searchAllProduct)

app.get('/categories',getAllcategories)

app.get('/admin-products',adminOnly,getAdminProduct)

app.route('/:id').get(getSingleProduct).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,deleteProduct);

export default app;