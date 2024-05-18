import mongoose from "mongoose";
import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/User.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, countInStock, category, rating } = req.body;

  if (
    [name, description, price, countInStock, category, rating].some(
      (field) => field?.trim() === ""
    )
  ) {
    res.status(400);
    throw new Error("Please provide all the fields");
  }

  const existedProduct = await Product.findOne({ name });

  if (existedProduct) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const imageUrlLocalPath = req.file?.path;

  if (!imageUrlLocalPath) {
    res.status(400);
    throw new Error("Please provide an image URL");
  }

  const imageUrl = await uploadOnCloudinary(imageUrlLocalPath);

  if (!imageUrl) {
    res.status(500);
    throw new Error("Couldn't upload image URL");
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    countInStock,
    imageUrl: imageUrl.url,
    category,
    rating,
  });

  const createdProduct = await Product.findById(newProduct._id);

  if (!createdProduct) {
    res.status(500);
    throw new Error("Couldn't create product");
  }

  res.status(201).json({
    _id: createdProduct._id,
    name: createdProduct.name,
    description: createdProduct.description,
    price: createdProduct.price,
    countInStock: createdProduct.countInStock,
    imageUrl: createdProduct.imageUrl,
    category: createdProduct.category,
    rating: createdProduct.rating,
  });
});

const addProductToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = req.user;

  if (!user.cart.includes(productId)) {
    user.cart.push(productId);
  }

  await user.save({ validalidateBeforeSave: false });

  res.status(200).json({
    message: "Product added to cart successfully",
  });
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = req.user;

  const index = user.cart.indexOf(productId);

  if (index > -1) {
    user.cart.splice(index, 1);
  }

  await user.save({ validalidateBeforeSave: false });

  res.status(200).json({
    message: "Product removed from cart successfully",
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (!products) {
    res.status(404);
    throw new Error("No products found");
  }

  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

const getCartProducts = asyncHandler(async (req, res) => {
  const user = req.user;

  const products = await Product.find({ _id: { $in: user.cart } });

  if (!products) {
    res.status(404);
    throw new Error("No products found in cart");
  }

  res.status(200).json(products);
});

export {
  createProduct,
  addProductToCart,
  removeProductFromCart,
  getProducts,
  getProductById,
  getCartProducts,
};
