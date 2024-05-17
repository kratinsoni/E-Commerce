import Router from "express";
import {
  createProduct,
  addProductToCart,
  removeProductFromCart,
  getProducts,
  getProductById,
  getCartProducts,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create-product")
  .post(verifyJWT, upload.single("imageUrl"), createProduct);
router.route("/add-to-cart").patch(verifyJWT, addProductToCart);
router.route("/remove-from-cart").patch(verifyJWT, removeProductFromCart);
router.route("/get-product/:id").get(getProductById);
router.route("/get-products").get(getProducts);
router.route("/get-cart-products").get(verifyJWT, getCartProducts);

export default router;
