import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";


/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);                      // Minimalistic pathot => get(), post()  ko'p ishlatamiz
routerAdmin
.get("/login", restaurantController.getLogin)
.post("/login", restaurantController.processLogin);                    // get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
routerAdmin
.get("/signup", restaurantController.getSignup)
.post(
    "/signup", 
    makeUploader("members").single("memberImage"), // rasmni yuklyapti
    restaurantController.processSignup
    );
routerAdmin.get("/logout", restaurantController.logout)
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
routerAdmin.get(
    "/product/all", 
    restaurantController.verifyRestaurant, //agar murojatchi restaran bo'lsa keyingi progressga o'tadi. middleware  bo'lgani uchn => oraliq mantiq
    productController.getAllProducts
);
routerAdmin.post(
    "/product/create",
    restaurantController.verifyRestaurant, // productlarni ham faqat restauran member hosil qiladdi yani restaranga bo'g'liq bogani uchun bu q'yildu
    // uploadProductImage.single("productImage"),
    makeUploader("products").array("productImages", 5), // 5ta img
    productController.createNewProduct
    );
routerAdmin.post(
    "/product/:id", 
    restaurantController.verifyRestaurant, 
    productController.updateChosenProduct
    );
/** User */

export default routerAdmin;