import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";


router.post("/login", memberController.login);                    // get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
router.post("/signup", memberController.signup);

export default router;