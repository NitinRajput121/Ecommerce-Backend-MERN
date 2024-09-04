import mongoose from "mongoose"
import { invalidateCacheProps, orderItemsType } from "../types/types.js"
import { myCache } from "../app.js"
import { Product } from "../models/Product.js"
import { Order } from "../models/order.js"


export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_24"
    }).then(() => {
        console.log("Database connected")
    }).catch((error) => {
        console.log(error)
    })
}

export const invalidateCache = async ({ product, order, admin, userId, orderId, productId }: invalidateCacheProps) => {

    if (product) {
        const productKeys: Array<string> = ["latest-product", "categories", "all-products"];

        if (typeof productId === "string") productKeys.push(`product-${productId}`);

        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));

        myCache.del(productKeys);
    }

    if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];



        myCache.del(orderKeys);

    }
    if (admin) {

    }




}


export const reducestock = async (orderItems: orderItemsType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) throw new Error("product not found")
        product.stock -= order.quantity;
        await product.save()
    }
}
 


export const caculatePercentage = (thisMonth:number,lastMonth:number) => {

    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return (percent.toFixed(0));

}




export const getInventories = async ({
    categories,
    productsCount,
  }: {
    categories: string[];
    productsCount: number;
  }) => {
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
  
     const categoriesCount = await Promise.all(categoriesCountPromise);
  
    const categoryCount: Record<string, number>[] = [];
  
    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });

    
  
    return categoryCount;
  };
