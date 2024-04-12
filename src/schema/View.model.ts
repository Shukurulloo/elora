import mongoose, {Schema} from "mongoose";
import { ViewGroup } from "../libs/enums/view.enum";

const viewSchema = new Schema({ 
    viewGroup: {
        type: String,
        enum: ViewGroup,
        required: true,
    },

    memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Member"   // memberschema modulga qaratilgan bo'ladi yozmasakham bo'ladi
    },

    viewRefId: {  // nimani ko'rayotgan bo'lsak o'sha  viewRefId degan ma'noni anglatadi
        type: Schema.Types.ObjectId,     // productni id si bo'ladi
        required: true,
    },
    }, 
    { timestamps:  true }
);

export default mongoose.model("View", viewSchema);