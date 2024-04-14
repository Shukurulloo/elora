import Errors, { HttpCode, Message } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {  // tomosha qilishlarni ro'yhatga oladigon mantiq
    private readonly viewModel; // schema modulni chaqiramz

    constructor() {
        this.viewModel = ViewModel;  // ihtiyoriy joylarda ishlatish qulay bo'lishi uhun  tenglab oldik
    }

    // defination: ko'rmoqchio bgan user productni oldin ko'rganmi tekshirish
    public async checkViewExistence(input: ViewInput):  Promise<View> {
       return await this.viewModel    // schema modlni finone ishlatildi
            .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
            .exec(); // memberIdni inputdan kegan memberIdga tenglab 
    }

  // defination: viewSchemaModel orqali collectionga dokumnetni hosl qilamz
    public async insertMemberView(input: ViewInput): Promise<View> {
        try {               
        return await this.viewModel.create(input);   // viewSchemaModel orqali collectionga dokumnetni hosl qilamz
        } catch(err) {                                // agar hosl qilishda hatolik bo'lsa errorni throw qilamz databace bgani ucn
            console.log("ERROR, model:insertmemberView", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }
}

export default ViewService;