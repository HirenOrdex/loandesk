import { Router } from "express";
import { NewDealController } from "../controllers/newDealController";
import { BorrowerCompanyValidations } from "../validators/newDealValidator";

const router = Router();
const newDealController = new NewDealController();
// router.post("/bankers", validateBankerRequest, BankerController.createBanker);
router.post("/borrower-company", BorrowerCompanyValidations, newDealController.createBorrowerCompany);
export default router;
