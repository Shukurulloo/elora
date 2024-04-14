import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { Order, OrderItemInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {ObjectId} from "mongoose";

// orderServiceModul 2 xil collection bilan birga ishlaydi
class OrderService {
    private readonly orderModel;  // 2ta schema modul kerak
    private readonly orderItemModel;

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
    }

    public async createOrder(
        member: Member, 
        input: OrderItemInput[]
    ): Promise <Order> { // kim orderni hosil qilishi, va input
        const memberId = shapeIntoMongooseObjectId(member._id);
        /** shart; 100$gacha  mahsulot zakaz qilinsa 5$ yetkazishTolovini elon qilamz 
         * agar 100$dan oshsa tekinga yetkazamz degan mantig'i*/ 
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity // umumiy narxni chiqarish mantig'i yani mahsulot miqdorioni narxiga ko'paytirdik
        }, 0);
        const delivery = amount < 100 ? 5 : 0; // turnery: agar 100dan kichik bo'lsa 5 tenga va katta bo'lsa 0 tekn

        try { // database validationi(tasdiq) da hatolik bo'lsa customized errorimzni  beramz
            const newOrder: Order = await this.orderModel.create({// oxirida creatd bo'ganida order qaytish mantig'i
                orderTotal: amount + delivery,   // jami
                orderDelivery: delivery,
                memberId: memberId,         //kim murojat qilishi
            }); 

            const orderId =  newOrder._id; // mongodb orqali qabul qilgan orderId
            console.log("orderId:",  orderId);
            // shu orderni hosil qilishda foydalanilgan order itemlarniham hosl qilish mantig'i
            await this.recordOrderItem(orderId, input);

            return newOrder;   // oxirida hosl bo'lgan yangi orderni o'zini qaytaramz
        }catch(err) {
            console.log("Error, model:createdOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }

    private async recordOrderItem(
        orderId: ObjectId, 
        input: OrderItemInput[]
    ): Promise<void> {
        // har bir orderga dahldor bo'gan  malumotlarni ketma ketlikda orderItemsga saqlash
        const promisedList = input.map( async (item: OrderItemInput) => {  // map+filter+async use, for+while+async don't use  
            item.orderId = orderId;
            item.productId = shapeIntoMongooseObjectId(item.productId); // secior qilish un str obj
            await this.orderItemModel.create(item);
            return "INSERTED";
        });

        const orderItemsState = await Promise.all(promisedList); // databacega to'liq create qimaguncha javob bermedi
        console.log("orderItemsState:", orderItemsState);

    }
}

export default OrderService;