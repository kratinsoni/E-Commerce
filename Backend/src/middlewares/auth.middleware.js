import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed: ", error?.message);
  }
});
