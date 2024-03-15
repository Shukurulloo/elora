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
}

export default ProductService;