import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader"

/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
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
router.post(
    "/member/update",              // enpointga post amalga oshirilsa
    memberController.verifyAuth, // authinticed bo'lgan user bo'lsa
    uploader("members").single("memberImage"), // members folderni ichiga rasmni yuklanadi va bitta rasm bo'lsin nomi memberImage bo'lsin schemada aytilgandek
    memberController.updateMember // keyin buyerga yo' oladi
    );
router.get("/member/top-users", memberController.getTopUsers)

/** Product **/

/** Order **/
export default router;