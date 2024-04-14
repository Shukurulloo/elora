import { T } from "../libs/types/common";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductInquiry } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { ProductStatus } from "../libs/enums/product.enum";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
    private readonly productModel; //property ni hosil qildik
    public viewService;

    constructor() {
        this.productModel = ProductModel;
        this.viewService = new ViewService()    // inctance
    }

    /** SPA = Single Page Application */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match: T = { productStatus: ProductStatus.PROCESS };  // processda bo'lgan productlarni matchga tenglaymiz

        if(inquiry.productCollection)  // agar postmandan yuborilgan bo'lsa yani mavjud bo'lsa 
            match.productCollection = inquiry.productCollection; //inquirydan kelgan productCollectionni tenglab beradi
        if(inquiry.search) {           // agar search bo'lsa product name orqali topsin
            match.productName = { $regex: new RegExp(inquiry.search, "i") }; // product nameni ichidan izlaydigon mantiq
        }                                             // inquirydan kelayotgan searchni flagini i qilib harfni katta kichik va harflar ketma-ketligi o'xshash bo'lsa ham farqsz qidirishini belgilaymiz

        const sort: T =                     // pastdagi shartlar bilan sortlab beradi
            inquiry.order === "productPrice"        // agar order productPricega teng bo'lsa
                ? { [inquiry.order]: 1 }            // narxi eng arzonidan boshlab yuqoriga. [inquiry.order]bu key array emas
                : { [inquiry.order]: -1 };          // aks holda (createdAt)bo'lsa eng oxirgi qo'shilgandan pastga tushadi

        const result = await this.productModel        // schema modul orqali 1ta argumentli aggregationdan foydalanamz
            .aggregate([                            // aggregateni (static) ichida array ko'rinishida bo'ladi arrayni ichida pipelinelar bo'ladi
                { $match: match },                  // processda bo'lgan productlarni olib beradi
                { $sort: sort },                    // sortlaymiz
                { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //biz postmanda 3ni belgilasak 3ta(X 1,2,3) skip qiladi , skip: boshlang'ich nechta dokumentga o'tkazib yuborshi , bu va pastdagi 2si pagination qiladi.
                { $limit: inquiry.limit * 1 },     // ( 3 => 4, 5, 6, ta dokumnetni ko'rsatadi) bizga aynan nechta malumot kerak  
            ])
            .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    // 2xil result qaytadi  1-login bo'magan va productni oldin ko'rgan bosa result1
    // 2-login bo'lib productni oldin ko'rmagan bo'lsa +1 view qo'shib result 2
    public async getProduct(
        memberId: ObjectId | null,  // 1-param mongodbini object id interfacesi yoki null yani login bo'lmagan user bo'lsa null bo'ladi
        id: string                  // 2-param biz ko'rmoqchi bo'lgan prductni id si biz id deb belgilaganmiz
       ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);  // stringni  ObjectId ga o'giramz

        let result = await this.productModel                // 1-result, schema moduldan foydalanib
        .findOne({                     //findone static methotida
            _id: productId,            // productIdga teng productni topib ber
            productStatus: ProductStatus.PROCESS,   // holati faqat process bo'lgani ko'rinsin
        })
        .exec();       // customized eror
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

     
        if(memberId) { // login bo'lib ilgari ko'rgan bo'lsa  !existView bu ishlamaydi yuqoridagi result qaytadi
            // call: Check Existence 
            const input: ViewInput = {     // interfacega tenlab
                memberId: memberId,    // har birini  interfacega tenlaymiz
                viewRefId: productId,
                viewGroup: ViewGroup.PRODUCT, //ViewGroupni ichidan productni qo'yishini talab qilamz
            };
            const existView = await this.viewService.checkViewExistence(input); //productni oldin ko'rganmi tekshirish

            console.log("exist:", !!existView);
            if(!existView) {    // agar login bo'gan user oldin ko'rmagan bo'lsa pastdagi result qaytadi
              // Insert View
                await this.viewService.insertMemberView(input); // inputni pass qilib

             // Increase Counts (+1 taga oshirish) member or article
                result = await this.productModel      // schema 2-result +1 view
                    .findByIdAndUpdate( // 3ta argumnet
                        productId, 
                        { $inc: {productViews: +1 } }, // $inc incrinetion sintaksidan foydalanib 1+ oshir mantigi'ini yozamz
                        { new: true }         // yangi malumotni qaytarsin
                    )
                    .exec();
            }
        }

        return result;   // login bo'magan bo'lsa oddiy result login bo'lgan bo'lsa mantiqli resul
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