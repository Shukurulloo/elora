import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";

/** Member **/
router.post("/member/login", memberController.login);                    //rest. get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
router.post("/member/signup", memberController.signup);
router.post(
    "/member/logout",             // shu yerga post qilinsa
    memberController.verifyAuth, // bu middlwere orqali auth bo'lgani tekshiriladi va keyingi jarayonga o'tib
    memberController.logout      // cookiedan accessTokenni o'chirib beradi
    );
router.get(
    "/member/detail", 
    memberController.verifyAuth, 
    memberController.getMemberDetail
    );


/** Product **/

/** Order **/
export default router;