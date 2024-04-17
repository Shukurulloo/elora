import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import MemberService from "./Member.service";

// orderServiceModul 2 xil collection bilan birga ishlaydi
class OrderService {
    private readonly orderModel;  // 2ta schema modul kerak
    private readonly orderItemModel;
    private readonly memberServise; // memberServise object

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberServise = new MemberService();
    }

    public async createOrder(
        member: Member,                // kim orderni hosl qilyotgani
        input: OrderItemInput[]        // va input 3ta malumot kritiladi
    ): Promise <Order> { 
        const memberId = shapeIntoMongooseObjectId(member._id);
        /** shart; 100$gacha  mahsulot zakaz qilinsa 5$ yetkazishTolovini elon qilamz 
         * agar 100$dan oshsa tekinga yetkazamz degan mantig'i*/ 
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => { // input bu array
            return accumulator + item.itemPrice * item.itemQuantity // umumiy narxni chiqarish mantig'i yani mahsulot miqdorioni narxiga ko'paytirdik
        }, 0); // reduceda 2ta argument bo'ladi 1function 2 initial value
        const delivery = amount < 100 ? 5 : 0; // turnery: agar 100dan kichik bo'lsa 5 tenga va katta bo'lsa 0 tekn

        try {  //orederSchema modulni create methodi orqali oredrni hosl qilamz
            const newOrder: Order = await this.orderModel.create({// oxirida creatd bo'ganida order qaytish mantig'i
                orderTotal: amount + delivery,   // ordet total qiymati teng bo'ladi yetkazish puli va product narxi
                orderDelivery: delivery,
                memberId: memberId,         //kim murojat qilishi
            }); 

            const orderId =  newOrder._id; // mongodb orqali qabul qilgan orderId
            console.log("orderId:",  orderId);

            // shu orderni hosil qilishda foydalanilgan order itemlarniham hosl qilish mantig'i// productni narxi o'zgarib turgani uchun saqlab olamz
            await this.recordOrderItem(orderId, input);

            return newOrder;   // oxirida hosl bo'lgan yangi orderni o'zini qaytaramz
        }catch(err) { // database validationi(tasdiq) da hatolik bo'lsa customized errorimzni  beramz
            console.log("Error, model:createdOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }

    private async recordOrderItem(
        orderId: ObjectId, //qaysi orderga tegishli ekani
        input: OrderItemInput[] //OrderItemInputdan tashkil topgan array
    ): Promise<void> { // void yani hech qanday return qiymati mavjud bo'lmasin
        // har bir orderga dahldor bo'gan  malumotlarni ketma ketlikda orderItemsga saqlash
        const promisedList = input.map( async (item: OrderItemInput) => {  // map+filter+async use, for+while+async don't use  
            item.orderId = orderId;
            item.productId = shapeIntoMongooseObjectId(item.productId); // secior qilish un str obj
            await this.orderItemModel.create(item); //orderItem schema Modelni create static methotiga itemni pas qilamz
            return "INSERTED"; // inputni map qilgan vaqti muofaqiyatli bo'lsa shu logni qaytarsin
        });
        // promisedListni(array) ichidag har mantiqni bajarib beradigon promisni all methotidan foydalanamz unga pass qilamz
        const orderItemsState = await Promise.all(promisedList); // databacega to'liq create qimaguncha javob bermedi
        console.log("orderItemsState:", orderItemsState);

    }

    public async getMyOrders(
        member: Member,          // kimning orderlarini topish kerakligi
        inquiry: OrderInquiry
    ): Promise<Order[]> {        //orderdan iborat array
        const memberId = shapeIntoMongooseObjectId(member._id);
        const matches = {memberId: memberId, orderStatus: inquiry.orderStatus}; // shu shart orqali reques qigan memberni id bilan kiritilgan va order statusi pause dan iborat  orderni topib berish

        const result = await this.orderModel
        .aggregate([  
            {$match: matches},
            {$sort: {updateAt: -1}}, // yuqoridan pastga yani oxrgi o'zgargani yuqorida ko'rinadi
            {$skip: (inquiry.page -1) * inquiry.limit},
            {$limit: inquiry.limit}, // [OrderData1], [OrderData2]
            {
                /** bu bir vaqtning o'zida aggrigationda topilgan mantiqni 
                 * har bitta natijasini ichida itiration qilish imkonini beradi va 
                 * har bitta itirate qilyatganda boshqa bir collectionga borib 
                 * malumotlarni topib berish imkonini beradi*/
                $lookup: {   
                    from: "orderItems", // shu collectiondan qidir
                    localField: "_id", // hozr aggrigateda turgan localfield _id qiymatini olib
                    foreignField: "orderId", //ordersni ichidagi slesh id orderItemsni ichidagi orderId datasetiga teng bo'lganni topib ber
                    as: "orderItems", // va malumotni saqlab ber orderItems nomi ostida
                },
            },
            {   
                $lookup: {
                    from: "products",// products colectiondan izla
                    localField: "orderItems.productId",// orderItemsni ichidan productIdni ol
                    foreignField: "_id",
                    as: "productData" // shu nom bilan saqla
                }
            }
        ])
        .exec();
        if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async updateOrder(
        member: Member, 
        input: OrderUpdateInput
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id),
            orderId = shapeIntoMongooseObjectId(input.orderId),
            orderStatus = input.orderStatus;

        const result = await this.orderModel.findOneAndUpdate({
            memberId: memberId, 
            _id: orderId,
        }, 
        {orderStatus: orderStatus}, // faqat birgina orderStatusni o'zgartir
        {new: true}
        )
        .exec();

        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        // orderStatus PAUSE => PROCESS +1 point
        if(orderStatus === OrderStatus.PROCESS) { //agar puseddan processga o'tsa +1 point qo'sh
            await this.memberServise.addUserPoint(member, 1);
        }            // memberServise modulini addUserPoint methodini ichigiga member va 1ga oshir
        return result;
    }
}

export default OrderService;