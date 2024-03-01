import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";

/** Restaurant */
routerAdmin.get("/", restaurantController.goHome);                            // Minimalistic pathot => get(), post()  ko'p ishlatamiz
routerAdmin
.get("/login", restaurantController.getLogin)
.post("/login", restaurantController.processLogin);                    // get() pagega kirish malumot olish uchun // post() malumotni o'zgartirish uchun    
routerAdmin
.get("/signup", restaurantController.getSignup)
.post("/signup", restaurantController.processSignup)

/** Product */
/** User */

export default routerAdmin;