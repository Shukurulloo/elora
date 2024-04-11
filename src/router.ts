import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader"
import productController from "./controllers/product.controller";
// routerda  single page aplication uchun hizmat qiladigon rest Api backend serverni quramz
/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
router.post("/member/login", memberController.login);                    //rest. get() Api pagega kirish malumot olish uchun headres orqali 
router.post("/member/signup", memberController.signup);                    // post() Api malumotni o'zgartirish uchun  bodu orqali
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
router.get("/product/all/", productController.getProducts); // all/ dan keyin harqanday data parms deb belgilaymiz

/** Order **/
export default router;