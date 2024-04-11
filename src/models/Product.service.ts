import { T } from "../libs/types/common";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductInquiry } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";

class ProductService {
    private readonly productModel; //property ni hosil qildik

    constructor() {
    this.productModel = ProductModel;
    }

    /** SPA = Single Page Application */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match: T = { productStatus: ProductStatus.PROCESS };  // processda bo'lgan productlarni matchga tenglaymiz

        if(inquiry.productCollection)  // agar postmandan yuborilgan bo'lsa yani mavjud bo'lsa 
            match.productCollection = inquiry.productCollection; //inquirydan kelgan productCollectionni tenglab beradi
        if(inquiry.search) {           // agar search bo'lsa product name orqali topsin
            match.productName = { $regex: new RegExp(inquiry.search, "i") }; // product nameni ichidan izlaydigon mantiq
        }                                          // inquirydan kelayotgan searchni flagini i qilib harfni katta kichik farqsz qidirishini belgilaymiz

        const sort: T =  // pastdagi shartlar bilan sortlab beradi
            inquiry.order === "productPrice" // agar order productPricega teng bo'lsa
                ? { [inquiry.order]: 1 }          // narxi eng arzonidan boshlab yuqoriga. [inquiry.order]bu key array emas
                : { [inquiry.order]: -1 };   // aks holda (createdAt)bo'lsa eng oxirgi qo'shilgandan pastga tushadi

        const result = await this.productModel        // schema modul orqali 1ta argumentli aggregationdan foydalanamz
            .aggregate([                            // aggregateni ichida array ko'rinishida bo'ladi arrayni ichida pipelinelar bo'ladi
                { $match: match },                  // processda bo'lgan productlarni olib beradi
                { $sort: sort },                    // sortlaymiz
                { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //biz postmanda 3ni belgilasak 3ta(X 1,2,3) scip qiladi , skip: boshlang'ich nechta dokumentga o'tkazib yuborshi , bu va pastdagi 2si pagination qiladi.
                { $limit: inquiry.limit * 1 },     // ( 3 => 4, 5, 6, ta dokumnetni ko'rsatadi) bizga aynan nechta malumot kerak  
            ])
            .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async getProduct(
        memberId: ObjectId | null, 
        id: string 
       ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);

        let result = await this.productModel
        .findOne({
            _id: productId, 
            productStatus: ProductStatus.PROCESS,
        })
        .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        // TODO: If authenticated users => first => view log creation

        return result;
    }

    /** SRR = Server Site Rendering */

    public async getAllProducts(): Promise<Product[]> { // arrayni ishida productlarni qaytarishi kerak
        const result = await this.productModel.find().exec();                          
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND); // result bo'lmsa erroni qaytarsn
        
        return result;  // result <Product> ni qaytaradi
        }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {  // prodct schema modulni create methodi bor unga inputni pass qilamz va bizga Product hosil qiberadi
         return await this.productModel.create(input);
        } catch (err) {
        console.log("Error, model:createNewProduct:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // databace monguse errorni o'rniga
        }
    }

    public async updateChosenProduct(
        id: string,
        input: ProductInput
        ): Promise<Product> {
           // stringni  ObjectId ga o'giramz
         id = shapeIntoMongooseObjectId(id);
           /** productSchemaModel chaqramz uni findOneAndUpdate static methodini olib 
             unga 3ta argumentni qabul qilamz*/
        const result = await this.productModel
            .findOneAndUpdate({_id: id}, input, { new: true }) //idni topish, inputni o'zgartirish, o'zgarganni qaytarish
            .exec();                           // new: true o'zgargan malumot
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED); // result bo'lmsa erroni qaytarsn
        
        
        return result;  // result <Product> ni qaytaradi
        }

}

export default ProductService;