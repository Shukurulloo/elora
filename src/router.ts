import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";

/** Member **/
router.post("/member/login", memberController.login);                    //rest. get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
router.post("/member/signup", memberController.signup);
router.get("/member/detail", memberController.verifyAuth)


/** Product **/

/** Order **/
export default router;