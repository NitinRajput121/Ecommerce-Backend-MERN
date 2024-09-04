import { myCache } from "../app.js";
import { tryCatch } from "../middlewares/error.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { caculatePercentage, getInventories } from "../utils/features.js";


export const getDashboardStats = tryCatch(
  async (req, res, next) => {
    let stats = {};

    const key = "admin-stats";

    if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string);
    else {
      const today = new Date(); //end of the current month

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };

      const thisMonthProductsPromise = Product.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthProductsPromise = Product.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthUsersPromise = User.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthUsersPromise = User.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const lastSixMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      });


      const latestTransactionsPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);




      const [
        thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,
        lastSixMonthOrders,
        productsCount,
        orderCount,
        userCount,
        categories,
        latestTransactions

      ] = await Promise.all([
        thisMonthProductsPromise,
        thisMonthUsersPromise,
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise,
        lastSixMonthOrdersPromise,
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments(),
        Product.distinct("category"),
        latestTransactionsPromise

      ])

      const thisMonthRevenue = thisMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );


      const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );



      const productChangePercent = caculatePercentage(
        thisMonthProducts.length, lastMonthProducts.length
      )

      const userChangePercent = caculatePercentage(
        thisMonthUsers.length, lastMonthUsers.length
      )

      const orderChangePercent = caculatePercentage(
        thisMonthOrders.length, lastMonthOrders.length
      )


      const categoryCount = await getInventories({
        categories,
        productsCount,
      });


      const modifiedLatestTransaction = latestTransactions.map((i) => ({
        _id: i._id,
        discount: i.discount,
        amount: i.total,
        quantity: i.orderItems.length,
        status: i.status,
      }));




      stats = {

        thisMonthRevenue,
        lastMonthRevenue


      }



      myCache.set("admin-stats", JSON.stringify(stats));



    }


    return res.status(200).json({
      success: true,
      stats
    });
  }
)


export const getPieCharts = tryCatch(
  async () => {

  }
)


export const getBarCharts = tryCatch(
  async () => {

  }
)



export const getLineCharts = tryCatch(
  async () => {

  }
)