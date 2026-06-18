import { errorResponse } from "../utils/apiResponse.js";

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, "Forbidden");
    }

    next();
  };
};