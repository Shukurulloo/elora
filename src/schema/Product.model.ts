import mongoose, {Schema} from "mongoose";
import { ProductCollection, ProductStatus, ProductSize, ProductVolume } from "../libs/enums/product.enum";

// Schema first & Code first  // skimalar noto'g'ri malumot kiritilmasligini taminlaydi
const productSchema = new Schema(
    {  // validation
     productStatus: {
        type: String,
        enum: ProductStatus,
        default: ProductStatus.PAUSE,
    },

     productCollection: {
        type: String,
        enum: ProductCollection,
        required: true, // shart
    },

    productName: {
        type: String,
        required: true,    
    },

    productPrice: {
        type: Number,
        required: true,
    },

    productLeftCount: {
        type: Number,
        required: true,
    },

    productSize: {
        type: String,
        enum: ProductSize,
        default: ProductSize.NORMAL,
    },

    productVolume: { // ichimlik
        type: String,
        enum: ProductVolume,
        default: ProductVolume.ONE,
    },

    productDesc: {
        type: String,
        required: true,    
    },
    
    productImages: {
        type: [String], // stringdan tashkil topgan array
        default: []  //kritilmasa bo'sh array
    },

    productViews: {
        type: Number,
        default: 0,
    }

    }, 
    {timestamps: true}       // updatedAt, createdAt
    );
    // unique sharti
    productSchema.index(
        {productName: 1, ProductSize: 1, ProductVolume: 1}, // somsa 1 marta ichimlik 1litr 1mart kitilish taminlanadi
        {unique: true}
        );
    export default mongoose.model("Product", productSchema);