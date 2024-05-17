import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    countInStock: {
      type: Number,
      required: [true, "Please provide a count in stock"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
