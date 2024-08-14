import route from "express";
import { loginController, registerController } from "../controllers/user.js";

const router = route.Router();

router.post("/register-user", registerController);
router.post("/login-user", loginController);
export default router;
