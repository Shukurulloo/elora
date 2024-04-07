import {Request, Response} from "express";
import {T} from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService()
const authService = new AuthService()

const memberController: T = {};
memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log("signup");
        const input: MemberInput = req.body, // refactoring: soddalashtirish
         result: Member = await memberService.signup(input),
         token = await authService.createToken(result); // yuqorida resultga tenglangan userni olib tokenga aylantiramz

         res.cookie("accessToken",token, { // 1)nomi , 2)nimani saqlash kerakligi
            maxAge: AUTH_TIMER * 3600 * 1000, // 3) yashah davomiyligi va
            httpOnly: false} // ?
            );

        res.status(HttpCode.CREATED).json({ member: result, accessToken: token }); // body qismiga member:result va  accesTokeni joylab yuboramz
    }   catch (err) {
        console.log("Error, signup:", err);
        if(err instanceof Errors) res.status(err.code).json(err); // bu errorga tegishli bolmasa pastagi ishlaydi
        else res.status(Errors.standard.code).json(Errors.standard);  // general errors
    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log("login");
        const input: LoginInput = req.body, 
         result = await memberService.login(input), // result bu user
         token = await authService.createToken(result);  // servise modulga borib tookenga(jbrshStringa) aylantirib uni constga tengladik
        console.log("token =>", token);
  
 // backentda muofaqiyatli hosil bo'lgan tokenni cookie() orqali browserni cookiesiga nom bn joylash mantig'i
        res.cookie("accessToken",token, { // 1)nomi , 2)nimani saqlash kerakligi
            maxAge: AUTH_TIMER * 3600 * 1000, // 3) yashah davomiyligi va
            httpOnly: false} // ?
            );

        res.status(HttpCode.OK).json({ member: result, accessToken: token }); // body qismiga member:result va  accesTokeni joylab yuboramz
    } catch (err) {
        console.log("Error, login:", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
};

export default memberController;
