const errorMiddleware = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  // error por defecto
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // errores de mongoose (validación)
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // error de cast (ObjectId inválido)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // error de duplicados
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate field: ${Object.keys(err.keyValue).join(", ")}`;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;