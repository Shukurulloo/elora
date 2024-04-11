import { ObjectId } from "mongoose";
import { 
    ProductCollection, 
    ProductSize, 
    ProductStatus 
} from "../enums/product.enum";

export interface Product {
    _id: ObjectId;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize: ProductSize;
    productVolume: number;
    productDesc?: string;
    productImages: string[]; // stringdan iborat array
    productViews: number;
}

export interface ProductInquiry {
    order: string;             //dinamic typing qilyapmiz
    page: number;
    limit: number;
    productCollection?: ProductCollection;
    search?: string;
}

export interface ProductInput {
    productStatus?: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize?: ProductSize;
    productVolume?: number;
    productDesc?: string;
    productImages?: string[]; // stringdan iborat array
    productViews?: number
}

export interface ProductUpdatetInput {
    _id: ObjectId;
    productStatus?: ProductStatus;
    productCollection?: ProductCollection;
    productName?: string;
    productPrice?: number;
    productLeftCount?: number;
    productSize?: ProductSize;
    productVolume?: number;
    productDesc?: string;
    productImages?: string[]; // stringdan iborat array
    productViews?: number
}