// Global Multer Error Handler
export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof Error && err.message.includes("already exists")) {
    return res.status(400).json({
      success: false,
      error: true,
      message: err.message,
    });
  }

  // Other multer errors
  if (err instanceof Error && err.message.includes("Unexpected")) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Invalid file upload!",
    });
  }

  next(err);
};
