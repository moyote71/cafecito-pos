import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";

export const authMiddleware = (req, res, next) => {

  // solo tests
  if (process.env.NODE_ENV === "test") {
    req.user = {
      id: new mongoose.Types.ObjectId().toString(),
      role: "admin"
    };
    return next();
  } 

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, 401, "No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid token");
  }
};