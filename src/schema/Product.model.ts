import mongoose, {Schema} from "mongoose";
import { ProductCollection, ProductStatus, ProductSize, ProductVolume } from "../libs/enums/product.enum";

// Schema first & Code first  // skimalar noto'g'ri malumot kiritilmasligini taminlaydi
const productSchema = new Schema(
    {  // validation
     productStatus: {
        type: String,
        enum: ProductStatus,   // enumimzga kiritilgan qiymatlardan boshqa qiymat qabul qilmaydi degan manoda
        default: ProductStatus.PAUSE, // ProductStatus ni PAUSE statesi bo'lsin
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

    productLeftCount: {  // mahsulot nechta borligi
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

    productDesc: {  // 제품 설명
        type: String,
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
    {timestamps: true}       // updatedAt, createdAt : Yangilangan va yaratilgan vaqti
    );
    // unique sharti
    productSchema.index(
        { productName: 1, productSize: 1, productVolume: 1 }, // somsa 1 marta ichimlik 1litr 1mart kitilish taminlanadi 
        { unique: true }  // 1.2 yoki 2litr kiritish mumkin bo'ladi
        );
    export default mongoose.model("Product", productSchema);