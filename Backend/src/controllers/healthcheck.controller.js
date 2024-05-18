import { asyncHandler } from "../utils/asynchandler";

const healthCheckController = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

export { healthCheckController };
