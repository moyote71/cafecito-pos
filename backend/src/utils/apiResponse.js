export const successResponse = (res, data, message = "OK") => {
  return res.status(200).json({
    success: true,
    data,
    message
  });
};

export const createdResponse = (res, data, message = "Created") => {
  return res.status(201).json({
    success: true,
    data,
    message
  });
};

export const errorResponse = (res, statusCode = 500, message = "Error", details = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    details
  });
};