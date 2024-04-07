export const AUTH_TIMER = 24;  // 24 soat davomida active bo'lishi
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;


// stringni mongoDB ObjectId ga o'tkazish mantig'i
/** kirib kelayotgan paramni(target)  birinchi typesini tekshiriramz agar us string bo'lsa,
     mongoDb ObjectId ga o'zgartiramz agar targetni typesi string bo'lmasa o'zini qaytaramz  */
import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
    return typeof target === 'string' ? new mongoose.Types.ObjectId(target) : target;
};

