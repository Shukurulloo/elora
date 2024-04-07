import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";


class AuthService {

    constructor() {

    }

    public async createToken(payload: Member) {
        return new Promise((resolve, reject) => { // resolve: hal qilish, reject: rad qilish
            const duration = `${AUTH_TIMER}h`; // davomiyligi const ga tengladik
            /** jwtni sign methotiga 4ta argument kiritiladi **/ 
            jwt.sign(
                payload,                             // 1) payload: tokenga aylantiradigon data. 
                process.env.SECRET_TOKEN as string,  //  2)SECRET_TOKEN ni string qilib
                {  
                expiresIn: duration                  // 3) expiresIn: davomiyligi.
            }, 
            (err, token) => {                        //  4) err function
                if(err)                                // Agar err bo'lsa customized err
                 reject(
                    new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
                    );
                else resolve (token as string);       // aks holda krib kelyotgan datani resolve qilamz ichiga token pass qilamz
            }
            );
        });
    }
}

export default AuthService;