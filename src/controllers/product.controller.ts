import {Request, Response} from "express";
import Errors from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";

const productService = new ProductService();

const productController: T = {}; // object
productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        res.render("products"); // products.ejs ga boradi
    }   catch (err) {
        console.log("Error, getAllProducts:", err);
        if(err instanceof Errors) res.status(err.code).json(err); // bu errorga tegishli bolmasa pastagi ishlaydi
        else res.status(Errors.standard.code).json(Errors.standard);  // general errors
    }
}

// yangi product hosil qilish
productController.createNewProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewProduct");
        res.send("DONE!");
    }   catch (err) {
        console.log("Error, createNewProduct:", err);
        if(err instanceof Errors) res.status(err.code).json(err); 
        else res.status(Errors.standard.code).json(Errors.standard); 
    }
}

// mavjud productni o'zgartirish
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewupdateChosenProductProduct");
     
    }   catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);  
    }
}


export default productController;