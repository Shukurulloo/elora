import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";

class ProductService {
    private readonly productModel; //property ni hosil qildik

    constructor() {
    this.productModel = ProductModel;
    }

    /** SPA = Single Page Application */

    /** SRR = Server Site Rendering */

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
           if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.UPDATE_FAILED); // result bo'lmsa erroni qaytarsn
        
        
            return result;  // result <Product> ni qaytaradi
        }

}

export default ProductService;