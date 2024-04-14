import mongoose, {Schema} from "mongoose";

const orderItemSchema = new Schema({
    itemQuantity: {
        type: Number,
        required: true,
    },

    itemPrice: {
        type: Number,
        required: true,
    },
// 1ta order bo'ladi unga dahldor bir nechta order bo'ladi
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
},
{ timestamps: true, collection: "orderItems" } // collectionni nomini camel case qilib qo'lda kiritdik
);// agar o'zmz kiritmasasak mongoDBda automatc OrderItems qilib ko'plikda collection hosil qilib beradi


export default mongoose.model("OrderItem", orderItemSchema);