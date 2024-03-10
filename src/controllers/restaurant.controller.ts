import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.anum";
import { Message } from "../libs/Errors";

const memberService = new MemberService(); // instanse olamz

const restaurantController: T = {};  // 
restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
        res.render("home"); // wiewni send qiladi
        // send | json | redirect | end | render
    } catch (err) {
        console.log("Error, goHome:", err);
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup");
        res.render("signup");
    } catch (err) {
        console.log("Error, getSignup:", err);
    }
}; 

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin");
        res.render("login");
    } catch (err) {
        console.log("Error, getLogin:", err);
    }
};


restaurantController.processSignup = async(
    req: AdminRequest, 
    res: Response
    ) => {  // oddiy requestni o'rniga AdminRequestni qo'ydik
    try {
        console.log("processSignup");

        const newMember: MemberInput = req.body;
        newMember.memberType = MemberType.RESTAURANT;
        const result = await memberService.processSignup(newMember);

         // TODO:  bu jarayon: frondEndimizga (Postmanga) borib Cokies ni ichiga sid ni joylab keladi va 
        // va databacedagi session collectionnga borib resul datani saqlaydi, 2 ta procces qilindi
         req.session.member = result;   // sessionni ichida member bor
         req.session.save(function() { // sessionlar muofaqqyatli save bo'lgach API ga javob yuboriladi
            res.send(result);
        }); 
    } catch (err) {
        console.log("Error, processSignup", err);
        res.send(err);
    }
};

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);

          req.session.member = result;   // sessionni ichida member bor
          req.session.save(function() { // sessionlar muofaqqyatli save bo'lgach API ga javob yuboriladi
             res.send(result);
         }); 

    } catch (err) {
        console.log("Error, processLogin", err);
        res.send(err)
    }
};

restaurantController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        if(req.session?.member) 
            res.send(`<script> alert("${req.session.member.memberNick}") </script>`);
        else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);
    } catch (err) {
        console.log("Error, checkAuthSession", err);
        res.send(err)
    }
};

export default restaurantController;