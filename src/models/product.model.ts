import mongoose, { Document, Schema } from "mongoose";
import toJSON from "@meanie/mongoose-to-json";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ProductProp {
  label: string;
  value: string;
  numeric?: boolean;
}

export interface ProductSchema extends Document {
  asin: string;
  title?: string;
  props?: ProductProp[];
}

export const ProductSchema = new Schema({
  asin: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    text: true
  },
  props: [
    {
      label: String,
      value: String,
      numeric: Boolean
    }
  ]
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(toJSON);

export const ProductModel = mongoose.model(
  "Product",
  ProductSchema,
  "products"
);
