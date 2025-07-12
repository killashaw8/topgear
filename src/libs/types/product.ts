import {ObjectId} from "mongoose";
import {
  ProductCollection,
  ProductStatus,
  ProductType
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productType: ProductType;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume: number;
  productDesc?: string;
  productProdYear: number
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  productType?: ProductType;
  productProdYear?: number;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productType: ProductType;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productVolume?: number;
  productDesc?: string;
  productProdYear?: number;
  productImages?: string[];
  productViews?: number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productType?: ProductType;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productVolume?: number;
  productDesc?: string;
  productProdYear?: number;
  productImages?: string[];
  productViews?: number;
}