import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken"; // buni install qildik


class AuthService {
    private readonly secretToken

    constructor() {
      this.secretToken = process.env.SECRET_TOKEN as string
    }
 // backentga tokenni(jibrish str) hosil qilsh mantig'i
    public async createToken(payload: Member): Promise<string> {       // payload member object type ko'rinishida
        return new Promise((resolve, reject) => {      // resolve: hal qilish(data qaytarish), reject: rad qilish(hatolik hosil qilish)
            const duration = `${AUTH_TIMER}h`;       //  tookenni davomiyligini const ga tengladik. cokiniki bn bir xil bo'lishi kerak
            /** jwtni sign methotiga 4ta argument kiritiladi **/ 
            jwt.sign(
                payload,                             // 1) payload: tokenga aylantiradigon data( kirib kelayotgan memberni datasi). 
                process.env.SECRET_TOKEN as string,  //  2)SECRET_TOKEN ni string qilib
                {  
                expiresIn: duration                  // 3) expiresIn:  duddat tugashi.
            }, 
            (err, token) => {                        //  4) callback function
                if(err)                                // Agar err bo'lsa customized err
                 reject(
                    new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
                    );
                else resolve (token as string);       // aks holda krib kelyotgan datani resolve qilamz ichiga token pass qilamz
            }
            );
        });
    }

    // mavjud bo'lgan tokenni ichidan malumotlarni chiqarib beradigon yani tokendan objectga aylantiradigon method
    public async checkAuth(token: string): Promise<Member> {
        const result: Member = (await jwt.verify( //verify ;tekshirish
            token, 
            this.secretToken
            )) as Member;
            console.log(`----- [AUTH] memberNick: ${result.memberNick} ----`);
            return result;
    }
}

export default AuthService;