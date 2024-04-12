import mongoose, {Schema} from "mongoose";
import { MemberType, MemberStatus } from "../libs/enums/member.enum";


// Schema first & Code first
const memberSchema = new Schema({
memberType: {
    type: String,
    enum: MemberType,
    default: MemberType.USER,
},

memberStatus: {
    type: String,
    enum: MemberStatus,
    default: MemberStatus.ACTIVE,
},

memberNick: {
    type: String,
    index: {unique: true, sparse: true}, // buyerda databaceda boshqa user bilan nicklari bir xil bo'lmasligini taminlaydi bir xil bo'lsa error qaytaradi
    required: true,
},

memberPhone: {
    type: String,
    index: {unique: true, sparse: true},          // validation 
    required: true,
},

memberPassword: {
    type: String,
    select: false,
    required: true,
},

memberAddress: {
    type: String,
},

memberDesc: {
    type: String,
}, 

memberImage: {
    type: String,
}, 

memberPoints: {
    type: Number,
    default: 0,
}, 
}, {timestamps: true}       // updatedAt, createdAt  va shuyerda collectionni auto members qib ochib beradi hohlasak nomini fixed qilib kiritishmizham mumkin
);

export default mongoose.model("Member", memberSchema);