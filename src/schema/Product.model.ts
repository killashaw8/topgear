import mongoose, {Schema} from "mongoose";
import {
  ProductStatus, 
  ProductType,
  ProductCollection
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productType: {
      type: String,
      enum: ProductType,
    },

    productProdYear: {
      type: Number,
      required: true
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String],
      default: []
    },

    productViews: {
      type: Number,
      default: 0,
    },

  }, 
  {timestamps: true}    // updatedAt, createdAt
);

productSchema.index(
    {productName: 1, productType: 1, productCollection: 1},
    {unique: true}
);
export default mongoose.model("Product", productSchema);