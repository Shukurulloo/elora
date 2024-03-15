import {Request, Response} from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";

const productService = new ProductService();

const productController: T = {}; // object
 /** SPA = Single Page Application */

/** SRR = Server Site Rendering  adminka */

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
productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("createNewProduct");
        /** buyerda kirib kelayotgan reques filesni ichidagi pathlarni ProductInput interface data ga saqlandi*/   
        if(!req.files?.length)   
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const data: ProductInput = req.body;
        data.productImages = req.files?.map((ele) => {      // yuklanayotgan faylarni pathini  provite qilamz
            return ele.path.replace(/\\/g, '/'); //ele (harbiri) ni ichidan path ni olamz va windowsga moslaymiz
        });        

        await productService.createNewProduct(data);

        res.send(
            `<script> alert("Sucessful creation!"); window.location.replace('admin/product/all') </script>`
            );
     }  catch (err) {
        console.log("Error, createNewProduct:", err);
        const message = 
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // bizni errorimzga tegishli bo'lsa
        res.send(
                `<script> alert("${message}"); window.location.replace('admin/product/all') </script>`
        );
    }
}

// mavjud productni o'zgartirish
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewupdateChosenProductProduct");
        const id = req.params.id; // requestni paramsi bor undan string idni olamz, url bo'lgani un strng
      
        const result = await productService.updateChosenProduct(id, req.body)

        res.status(HttpCode.OK).json({ data: result});
    }   catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);  
    }
}


export default productController;