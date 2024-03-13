import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";

/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);                      // Minimalistic pathot => get(), post()  ko'p ishlatamiz
routerAdmin
.get("/login", restaurantController.getLogin)
.post("/login", restaurantController.processLogin);                    // get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
routerAdmin
.get("/signup", restaurantController.getSignup)
.post("/signup", restaurantController.processSignup)
routerAdmin.get("/logout", restaurantController.logout)
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
routerAdmin.get(
    "/product/all", 
    restaurantController.verifyRestaurant, //middleware => oraliq mantiq
    productController.getAllProducts
);
routerAdmin.post(
    "/product/create",
    restaurantController.verifyRestaurant, 
    productController.createNewProduct
    );
routerAdmin.post(
    "/product/:id", 
    restaurantController.verifyRestaurant, 
    productController.updateChosenProduct
    );
/** User */

export default routerAdmin;