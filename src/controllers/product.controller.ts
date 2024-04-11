import {Request, Response} from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";

const productService = new ProductService();

const productController: T = {}; // object

/** SPA = Single Page Application */

productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        const {page, limit, order, productCollection, search} = req.query;  // postmanda kiritgan query datalarni chaqirdik
        const inquiry: ProductInquiry = {   // interfaceda belgilangan har biri kiritilishi kerak aks holda type error chiqadi
            order: String(order),       // stringa aylantirib beradi
            page: Number(page),
            limit: Number(limit),
        };
        if(productCollection) {  // agar productCollection bo'lsa enumda belgilangan typega tenglaymiz
            inquiry.productCollection = productCollection as ProductCollection;
        }
        if(search) inquiry.search = String(search);   // agar search bo'lsa stringa aylntir

        const result = await productService.getProducts(inquiry);

        res.status(HttpCode.OK).json(result);
    }   catch (err) {
        console.log("Error, getProducts:", err);
        if(err instanceof Errors) res.status(err.code).json(err);       // bu errorga tegishli bolmasa pastagi ishlaydi
        else res.status(Errors.standard.code).json(Errors.standard);         // general errors
    }
}

/** SRR = Server Site Rendering  adminka */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        const data = await productService.getAllProducts();

        res.render("products", { products: data }); // products.ejs ga boradi
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
        console.log("req.body:", req.body);
        /** buyerda kirib kelayotgan reques filesni ichidagi pathlarni ProductInput interface data ga saqlandi*/   
        if(!req.files?.length)   // kamida 1 ta rasm bo'lmasa error
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const data: ProductInput = req.body;
        data.productImages = req.files?.map((ele) => {      // yuklanayotgan faylarni pathini  provite qilamz
            return ele.path.replace(/\\/g, '/'); //ele (harbiri) ni ichidan path ni olamz va windowsga moslaymiz
        });        

        await productService.createNewProduct(data);

        res.send(
            `<script> alert("Sucessful creation!"); window.location.replace('/admin/product/all') </script>`
            );
     }  catch (err) {
        console.log("Error, createNewProduct:", err);
        const message = 
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG; // bizni errorimzga tegishli bo'lsa aks holda umumiy
        res.send(
                `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
        );
    }
}

// mavjud productni o'zgartirish
productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("createNewupdateChosenProductProduct");
        const id = req.params.id; // requestni paramsi bor undan string idni olamz, url bo'lgani un strng
      
        const result = await productService.updateChosenProduct(id, req.body)

        res.status(HttpCode.OK).json({ data: result}); // 200ni 
    }   catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);  
    }
}


export default productController;