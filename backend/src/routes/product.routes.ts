import { Router } from "express";

import { ProductController } from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const productController = new ProductController();

router.use(authenticate);

router.post("/", asyncHandler(productController.createProduct));
router.get("/", asyncHandler(productController.getProducts));
router.get("/:id", asyncHandler(productController.getProductById));
router.patch("/:id", asyncHandler(productController.updateProduct));
router.delete("/:id", asyncHandler(productController.deleteProduct));

export default router;
