import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export interface NewProductRequestBody {
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;

}

export interface SearchRequestQuery {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string
  
}

export interface BaseQuery {
  name?: {
    $regex: string,
    $options: string
  },
  price?: {$lte: number},
  category?: string
}

export type invalidateCacheProps = {
  product?:boolean;
  order?:boolean;
  admin?:boolean;
  userId?:string;
  orderId?: string;
  productId?:string | string[]
}

export type orderItemsType = {
name:string;
photo:string;
price:number;
quantity:number;
productId:string
required:boolean
}

export type shippingInfoType = {
  address:string;
  city:string;
  state:string;
  country:string;
  pincode:number
  }

export interface NewOrderRequestBody {
  shippingInfo:shippingInfoType;
  user:string;
  subtotal:number;
  tax:number;
  discount:number;
  shippingCharges:number;
  total:number;
  orderItems:orderItemsType[];

}