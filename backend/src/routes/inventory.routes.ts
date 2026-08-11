import { Router } from "express";

import { InventoryController } from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const inventoryController = new InventoryController();

router.use(authenticate);

router.post("/stock-in", asyncHandler(inventoryController.stockIn));
router.post("/stock-out", asyncHandler(inventoryController.stockOut));
router.get("/movements", asyncHandler(inventoryController.getMovements));
router.get("/products/low-stock", asyncHandler(inventoryController.getLowStockProducts));

export default router;
