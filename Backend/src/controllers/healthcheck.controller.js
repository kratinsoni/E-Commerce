import { asyncHandler } from "../utils/asynchandler.js";

const healthCheckController = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

export { healthCheckController };
