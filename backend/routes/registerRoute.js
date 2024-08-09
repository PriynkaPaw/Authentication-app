import route from "express";
import registerController from "../controllers/registerController.js";

const router = route.Router();

router.post("/register-user", registerController);

export default router;
