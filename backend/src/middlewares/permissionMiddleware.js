import { errorResponse } from "../utils/apiResponse.js";

export const permissionMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, "Forbidden - no permission");
    }

    next();
  };
};