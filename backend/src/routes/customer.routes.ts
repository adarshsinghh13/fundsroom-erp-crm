import { Router } from "express";

import { CustomerController } from "../controllers/customer.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const customerController = new CustomerController();

router.use(authenticate);

router.post("/", asyncHandler(customerController.createCustomer));
router.get("/", asyncHandler(customerController.getCustomers));
router.get("/:id", asyncHandler(customerController.getCustomerById));
router.patch("/:id", asyncHandler(customerController.updateCustomer));
router.delete("/:id", asyncHandler(customerController.deleteCustomer));

router.post("/:id/follow-ups", asyncHandler(customerController.createFollowUp));
router.get("/:id/follow-ups", asyncHandler(customerController.getFollowUps));

export default router;
