import cors from "cors";
import express from "express"; // wep server framebook
import path from "path";
import router from "./router";
import routerAdmin from "./router-Admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({  // natijani storega tenglaymiz
    uri: String(process.env.MONGO_URL), //process env ni ichidan MONGO_URL ni qabul qivolamz natijani stringa aylantiramz
    collection: 'sessions', // mongoDbni sessions collectionida hosil qilish
  });

/** 1-ENTRANCE  kirish**/
const app = express();
app.use(express.static(path.join(__dirname, "public")));// klientga ochib bersh
app.use("/uploads", express.static("./uploads")); // uploads folderi tashqariga ochildi
app.use(express.urlencoded({extended: true}));//htmlda forum traditional reqni kirishga ruhsat beradi nested req
app.use(express.json());// kirib kelayotgan res api ni body qismini serverga tashrifini amalga oshiradi
app.use(    // middleware pattern asosida integratsya
  cors({      // cors ihtiyoriy domendan kelayotgan requestlarni  servermga kirishiga rusat beradi
    credentials: true, // ihtiyoriy domen kirishga ruhsat
    origin: true 
  })
);
app.use(cookieParser()); // cookieParserni install qilb, inigratsiya qilamz
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS adminka **/
// bu mantiq: kelayotgan requestni cokieni ichidan sidni olib ses-collectiondan izlaydi mavjud bo'lsa datani requestga bog'lab beradi
app.use(
    session({  // yuqoridagi sessionni qo'yib uni ichiga obtionlarni beramiz
        secret: String(process.env.SESSION_SECRET), // SESSION_SECRET: sessionlarni hosil qilishda ishlatiladi uni 3-taraf ko'rmasligi kerak
        cookie: {
          maxAge: 1000 * 3600 * 6, // 6h sessionlar qancha vaqt amal qilishini anglatadi dolli sekunda
        },
        store: store, // yuqorida hosil qilgan qiymatni beramz
        resave: true,     // true: 10:30 auth => 16:30 agar 12:00da kirsak o'zini yangilaydi oxirgi kirganidan hisoblab o'chiradi. // false bo'lsa  3 soat orasda kirsaham o'sha vaqtda o'chadi
        saveUninitialized: true
    })
);
// browser uchn locals variablelari
app.use(function(req, res, next) { // hamma qilinyotgan requestlar uchn ishga tushadi
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member; // sessionsni ichidan memberni olib localsga berdik uni nomini member qildik va u ejsda ishladi
  next(); // res.locals browserni variablelari hamma page uchun kerak bo'lgan hollarda

})

/** 3-VIEWS adminka**/
app.set("views", path.join(__dirname, "views")); // midlver emas
app.set("view engine", "ejs"); // ejs orqali BSSR qurilayotganini set qilamz

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);   // SSR: EJS    Middleware Design Pattern
app.use("/", router);             // SPA: REACT.      


export default app; 