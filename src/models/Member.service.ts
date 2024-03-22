import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
    private readonly memberModel;

    constructor() {
    this.memberModel = MemberModel;
    }

/** SPA = Single Page Application */

    public async signup(input: MemberInput): Promise<Member> {             //<void> hechnimani qaytarmaslik(return) uchn
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result.toJSON(); // databacedan kelgan qiymatni jsonga o'giradi
        }   catch (err) {
            console.error("Error, model:signup", err); // consolga hato habarini yuboradi
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
    }

    public async login(input: LoginInput): Promise<Member> {
        // TODO: Consider member status later
        const member = await this.memberModel
            .findOne(
                {memberNick: input.memberNick, memberStatus: {$ne: MemberStatus.DELETE }}, // search
                {memberNick: 1, memberPassword: 1 , memberStatus: 1} // obtions
            )
            .exec();
        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if(member.memberStatus === MemberStatus.BLOCK){
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
        }
        console.log("member:", member);
            const isMatch = await bcrypt.compare(
                input.memberPassword, 
                member.memberPassword
            );
        if(!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).lean().exec(); //lean bilan databacedagi datani tahrirqilsh mn
    }

/** SRR */

    public async processSignup(input: MemberInput): Promise<Member> {             //<void> hechnimani qaytarmaslik(return) uchn
        const exist = await this.memberModel
            .findOne({memberType: MemberType.RESTAURANT})
            .exec();      // restaran 1tadan oshmasligi uchun
        console.log("exist:", exist);
        if(exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        console.log("before:", input.memberPassword);
        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
        console.log("after:",input.memberPassword);

        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result;
        }   catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED); // databace monguse errorni o'rniga
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                {memberNick: input.memberNick}, 
                {memberNick: 1, memberPassword: 1})
            .exec();
        if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

            const isMatch = await bcrypt.compare(
                input.memberPassword, 
                member.memberPassword
                );
        
        if(!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).exec();
    }

    public async getUsers(): Promise<Member[]> {            
        const result = await this.memberModel
        .find({ memberType: MemberType.USER })  // databacedan hamma userlarni topib ovolamz
        .exec();  

    if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);  // agar natija kelmasa Error

    return result;      // agar natija kelsa resultni controllerga qaytaramz
    }

    public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {   
        input._id = shapeIntoMongooseObjectId(input._id);         // stringni mongoDB ObjectId ga o'tkazish mantig'i
        const result = await this.memberModel
        .findByIdAndUpdate({ _id: input._id }, input, { new: true })  // databacedan hamma userlarni topib ovolamz
        .exec();                             // input ni o'zgartirib o'zgarganni qaytaramiz

    if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);  // agar natija kelmasa Error

    return result;      // agar natija kelsa resultni controllerga qaytaramz
    }
}

export default MemberService;