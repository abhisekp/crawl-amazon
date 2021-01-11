import mongoose, { Document, Schema } from "mongoose";
import toJSON from "@meanie/mongoose-to-json";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ProductPropSchema extends Document {
  label: string;
  value: string;
  numeric?: boolean;
}

export interface ProductSchema extends Document {
  asin: string;
  title?: string;
  props?: ProductPropSchema[];
  fetchedAt: Date;
  pdfFile?: string;
}

export const ProductPropSchema = new Schema<ProductPropSchema>(
  {
    label: String,
    value: String,
    numeric: Boolean
  },
  { _id: false }
);

export const ProductSchema = new Schema<ProductSchema>(
  {
    asin: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      text: true
    },
    props: [ProductPropSchema],
    fetchedAt: Date,
    pdfFile: {
      type: String,
      get() {
        return `${this.asin}.pdf`;
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true
    },
    toObject: {
      getters: true,
      virtuals: true
    }
  }
);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(toJSON);

export const ProductModel = mongoose.model<ProductSchema>(
  "Product",
  ProductSchema,
  "products"
);
