import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";

/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);                            // Minimalistic pathot => get(), post()  ko'p ishlatamiz
routerAdmin
.get("/login", restaurantController.getLogin)
.post("/login", restaurantController.processLogin);                    // get() Api pagega kirish malumot olish uchun // post() Api malumotni o'zgartirish uchun    
routerAdmin
.get("/signup", restaurantController.getSignup)
.post("/signup", restaurantController.processSignup)
routerAdmin.get("/logout", restaurantController.logout)
routerAdmin.get("/check-me", restaurantController.checkAuthSession);

/** Product */
/** User */

export default routerAdmin;