import ProductModel from "../schema/Product.model";

class ProductService {
    private readonly productModel; //property ni hosil qildik

    constructor() {
    this.productModel = ProductModel;
}
 }

export default ProductService;