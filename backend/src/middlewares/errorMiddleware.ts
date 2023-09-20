import CustomError from "../utils/customErrors";
import { Request, Response, NextFunction } from "express";
import multer from "multer";

const devErrors = (res: Response, error: any) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res: Response, error: CustomError) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!Please try again later.",
    });
  }
};

const castErrorHandler = (err: any) => {
  const msg = `Invalid value for ${err.path}:${err.value}!`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err: any) => {
  const email = err.keyValue.email;
  const msg = `There is already a user with email${email}.Please use another email!`;
  return new CustomError(msg, 400);
};

const validationErrorHandler = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => val.message);
  const errorMessages = errors.join(".");
  const msg = `Invalid input data:${errorMessages}`;

  return new CustomError(msg, 400);
};
const jwtErrorHandler = () => {
  const msg = "Invalid token. Please login again.";
  return new CustomError(msg, 401);
};

const jwtTokenExipirationErrorHander = () => {
  const msg = "Your token exipired. Please login again.";
  return new CustomError(msg, 401);
};

const multerErrorHandler = (error: any) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return new CustomError(
      "File size limit exceeded. Max file size is 2MB.",
      400
    );
  }
  if (error.code === "LIMIT_FILE_COUNT") {
    return new CustomError(
      "Too many files uploaded. Only one file is allowed.",
      400
    );
  }
  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return new CustomError(
      "Invalid field name. Only 'image' field is allowed.",
      400
    );
  }

  return error;
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "JsonWebTokenError") error = jwtErrorHandler();
    if (error.name === "TokenExpiredError")
      error = jwtTokenExipirationErrorHander();
    if (error instanceof multer.MulterError) error = multerErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    prodErrors(res, error);
  }
};

export default errorHandler;
