import { ObjectId } from "mongoose"
import { MemberStatus, MemberType } from "../enums/member.enum";
import { Request } from "express";
import { Session } from "express-session";

export interface Member {
    _id: ObjectId;
    memberType: MemberType;
    memberStatus: MemberStatus
    memberNick: string;
    memberPhone: string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number;
}

export interface LoginInput {
    memberNick: string;
    memberPassword: string;

}

// buyerda restaranimiz oddiy userlarni qanday malumotlarini o'zgartiraolish huquqini olishini belgilab beramz
export interface MemberUpdateInput {
    _id: ObjectId;
    memberStatus?: MemberStatus
    memberNick?: string;
    memberPhone?: string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
}

export interface ExtendedRequest extends Request {
    member: Member,
    file: Express.Multer.File; // bitta img(file) bo'sa
    files: Express.Multer.File[] // bir nechta img(file) bo'lsa
}

export interface AdminRequest extends Request {
    member: Member,
    session: Session & {member: Member}      // sessionni ichida memberni bor type ga hatolik bermasligi uchun
    file: Express.Multer.File;     //file mavjud , expressni ichida multer propertysini ichidan File qilib typesni belgilaymiz
    files: Express.Multer.File[]
}