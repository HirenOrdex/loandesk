import { Router } from "express";
import { NewDealController } from "../controllers/newDealController";
import { BorrowerCompanyValidations, guarantorCreateValidations } from "../validators/newDealValidator";

const router = Router();
const newDealController = new NewDealController();
// router.post("/bankers", validateBankerRequest, BankerController.createBanker);
router.post("/borrower-company", BorrowerCompanyValidations, newDealController.createBorrowerCompany);
router.post("/guarantors/:id", newDealController.createMultiple); 
router.get("/guarantors/:dealDataReqId",guarantorCreateValidations, newDealController.getByDealDataReqId);
router.patch("/borrower-company/:id", BorrowerCompanyValidations, newDealController.updateBorrowerCompany);
router.get("/borrower-company/:id", newDealController.getBorrowerCompanyById);
router.patch("/guarantors/:id",newDealController.updateGuarantor)
router.post('/loan-detail/:id',newDealController.createMultipleLoanDetails)
router.get('/loan-detail/:id',newDealController.createMultipleLoanDetails)

export default router;
