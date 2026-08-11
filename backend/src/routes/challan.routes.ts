import { Router } from "express";

import { ChallanController } from "../controllers/challan.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const challanController = new ChallanController();

router.use(authenticate);

router.post("/", asyncHandler(challanController.createChallan));
router.get("/", asyncHandler(challanController.getChallans));
router.get("/:id", asyncHandler(challanController.getChallanById));
router.patch("/:id/status", asyncHandler(challanController.updateChallanStatus));
router.delete("/:id", asyncHandler(challanController.deleteChallan));

export default router;
