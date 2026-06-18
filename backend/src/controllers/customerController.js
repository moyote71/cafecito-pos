import Customer from "../models/Customer.js";
import {
  successResponse,
  createdResponse,
  errorResponse
} from "../utils/apiResponse.js";

/**
 * CREATE CUSTOMER
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, phoneOrEmail } = req.body;

    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+\d{8,15}$/;

    if (!name || name.trim() === "") {
      errors.push({ field: "name", message: "name is required" });
    }

    if (name && (name.length < 2 || name.length > 100)) {
      errors.push({ field: "name", message: "2-100 characters required" });
    }

    if (!phoneOrEmail || phoneOrEmail.trim() === "") {
      errors.push({ field: "phoneOrEmail", message: "required" });
    } else {
      const isValid =
        emailRegex.test(phoneOrEmail) ||
        phoneRegex.test(phoneOrEmail);

      if (!isValid) {
        errors.push({
          field: "phoneOrEmail",
          message: "Must be email or phone"
        });
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 422, "Validation failed", errors);
    }

    const existing = await Customer.findOne({
      phoneOrEmail: phoneOrEmail.toLowerCase()
    });

    if (existing) {
      return errorResponse(res, 400, "Customer already exists", [
        { field: "phoneOrEmail" }
      ]);
    }

    const customer = await Customer.create({
      name,
      phoneOrEmail: phoneOrEmail.toLowerCase(),
      purchasesCount: 0
    });

    return createdResponse(res, customer, "Customer created");

  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
};

/**
 * GET CUSTOMERS
 */
export const getCustomers = async (req, res) => {
  try {
    let { page = 1, limit = 20, q = "" } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1 || limit > 100) {
      return errorResponse(res, 400, "Invalid pagination");
    }

    const skip = (page - 1) * limit;

    const filter = q
      ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { phoneOrEmail: { $regex: q, $options: "i" } }
        ]
      }
      : {};

    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(filter);

    return successResponse(res, {
      data: customers,
      total,
      page,
      limit
    });

  } catch (error) {
    return errorResponse(res, 500, "Error fetching customers");
  }
};

/**
 * GET BY ID
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return errorResponse(res, 404, "Customer not found");
    }

    return successResponse(res, customer);

  } catch (error) {
    return errorResponse(res, 500, "Error fetching customer");
  }
};

/**
 * DELETE CUSTOMER
 */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
       success: false,
        message: "Cliente no encontrado"
      });
    }

    await Customer.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Cliente eliminado"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar cliente",
      error: err.message
    });
  }
};