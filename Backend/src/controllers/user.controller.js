import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const accessToken = await user.generateAccessToken();
    if (!accessToken) throw new Error("Couldn't generate access token");
    console.log(accessToken);
    const refreshToken = await user.generateRefreshToken();
    if (!refreshToken) throw new Error("Couldn't generate refresh token");
    console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something Went Wrong While Refresh And Access Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, password, email].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new Error("Please provide all the fields");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const avatarLocalPath = req.file?.path;

  console.log(req.file?.path);

  if (!avatarLocalPath) {
    res.status(400);
    throw new Error("Please provide an avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  console.log(avatar);

  if (!avatar) {
    res.status(500);
    throw new Error("Couldn't upload avatar");
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(newUser._id).select("-password");

  if (!createdUser) {
    res.status(500);
    throw new Error("Couldn't create user");
  }

  res.status(201).json({
    _id: createdUser._id,
    fullName: createdUser.fullName,
    email: createdUser.email,
    avatar: createdUser.avatar,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide email");
  }

  if (!password) {
    res.status(400);
    throw new Error("Please provide password");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  console.log(accessToken, refreshToken);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    res.status(500);
    throw new Error("Couldn't login user");
  }

  const options = {
    httpOnly: false,
    secure: true,
    samesite: "none",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      accessToken,
      refreshToken,
    });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: false,
    secure: true,
    samesite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      "User Logged Out": "Successfully",
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    user: req.user,
    message: "User Found",
  });
});

export { registerUser, loginUser, logoutUser, getCurrentUser };
