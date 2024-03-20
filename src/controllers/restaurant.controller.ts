import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService(); // instanse olamz

const restaurantController: T = {};  // 
restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
        res.render("home"); // wiewni send qiladi
        // send | json | redirect | end | render
    } catch (err) {
        console.log("Error, goHome:", err);
        res.redirect("/admin");  // hatolik bo'lsa adminga yuborish uchn
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup");
        res.render("signup");
    } catch (err) {
        console.log("Error, getSignup:", err);
        res.redirect("/admin");  // hatolik bo'lsa adminga yuborish uchn
    }
}; 

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin");
        res.render("login");
    } catch (err) {
        console.log("Error, getLogin:", err);
        res.redirect("/admin");
    }
};


restaurantController.processSignup = async(
    req: AdminRequest, 
    res: Response
    ) => {  // oddiy requestni o'rniga AdminRequestni qo'ydik
    try {
        console.log("processSignup");
        const file = req.file; //yuklangan rasmni qabul qilyapmiz
        if(!file) // agar file yuklanmagan bo'lsa yuklanishni majbur qilamz
            throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG); // castomazik


        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g, '');
        newMember.memberType = MemberType.RESTAURANT;
        const result = await memberService.processSignup(newMember);

         // TODO:  bu jarayon: frondEndimizga (Postmanga) borib Cokies ni ichiga sid ni joylab keladi va 
        // va databacedagi session collectionnga borib resul datani saqlaydi, 2 ta procces qilindi
         req.session.member = result;   // sessionni ichida member bor
         req.session.save(function() { // sessionlar muofaqqyatli save bo'lgach API ga javob yuboriladi
            res.redirect("/admin/product/all");  // signup bo'lsa product list pagega yuborsin
        }); 
    } catch (err) {
        console.log("Error, processSignup", err);
        const message = 
        err instanceof Error ? err.message : Message.SOMETHING_WENT_WRONG
    res.send(
        `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`
        );
    }
};

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);

          req.session.member = result;   // sessionni ichida member bor
          req.session.save(function() { // sessionlar muofaqqyatli save bo'lgach API ga javob yuboriladi
            res.redirect("/admin/product/all"); 
         }); 

    } catch (err) {
        console.log("Error, processLogin", err);
        const message = //shart yozamz agar errorni intance si biz hosil qilgan error bo'lsa errorni ichiga kirib messageni ber
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG // agar error bo'lmasa messagda SOMETHING_WENT_WRONG ber deymiz
        res.send(
            `<script> alert("${message}"); window.location.replace('/admin/login') </script>`
            );  //muofaqiyatli bo'lmasa widowni joyini login page ga yuborsin
    }
};


// bu mantiq logout qilb session ni tozalab beradi va admin page ga yuboradi yani Homega
restaurantController.logout = async (req: AdminRequest, res: Response) => {
    try {    
        console.log("logout");
        req.session.destroy(function() { // requestni ichidan sessionni qabul qilib sessionni destroy(o'chirish) qilamz
            res.redirect("/admin");   // destroy qilgandan keyin admin page yuboradi
        });
    } catch (err) {
        console.log("Error, logout", err);
        res.redirect("/admin");
    }
};
restaurantController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers();  // member schemaModuldan getUsersni chaqiramz
        console.log("result:", result);

        res.render("users", {users: result}) //users nomli object bn qaytgan natija yani resultni provide qilamz
    } catch (err) {
        console.log("Error, getUsers:", err);
        res.redirect("/admin/login");
    }
};

restaurantController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenUser");
        const result = await memberService.updateChosenUser(req.body); 

        res.status(HttpCode.OK).json({ data : result})
    } catch (err) {
        console.log("Error, updateChosenUser:", err);
        if(err instanceof Errors) res.status(err.code).json(err); // bu errorga tegishli bolmasa pastagi standars error ishlaydi va fronendga yuboradi qiladi
        else res.status(Errors.standard.code).json(Errors.standard); 
    }
};



restaurantController.checkAuthSession = async ( 
    req: AdminRequest, 
    res: Response
    ) => {
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

// bu Authorization
// verify => tekshirish
// murojatchi kim ekanini aniqlash un va restaurant ekani haqida malumot berish kerak yani urlni faqat restran ishlatishi mumkin
restaurantController.verifyRestaurant = ( 
    req: AdminRequest, 
    res: Response, 
    next: NextFunction //middlever bo'lgani un next shart
  ) => { 
          if(req.session?.member?.memberType === MemberType.RESTAURANT) {
                req.member = req.session.member // murojatchi restaurant bo'lsa keyingi progresga o'tkazshi
                next(); // nextni qo'ymasa process qotib qoladi
        } else { // hatolik bo'lsa
            const message = Message.NOT_AUTHENTICATED /// kimdir kirishga harakat qilsa va u restaran bo'lmasa login page yuborsin
            res.send(`<script> alert("${message}"); window.location.replace('/admin/login'); </script>`
            );
          }
}

export default restaurantController;