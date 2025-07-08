import { ApiError } from "../utils/ApiError.js";
export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        throw new ApiError(401, "Invalid user role in token");
      }
      next();
    };
  };
  
