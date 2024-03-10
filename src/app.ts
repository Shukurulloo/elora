import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-Admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: 'sessions', // mongoDbni sessions collectionida hosil qilish
  });

/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
// bu mantiq: kelayotgan requestni cokieni ichidan sidni olib ses-collectiondan izlaydi mavjud bo'lsa datani requestga bog'lab beradi
app.use(
    session({
        secret: String(process.env.SESSION_SECRET), // SESSION_SECRET: sessionlarni hosil qilishda ishlatiladi uni 3-taraf ko'rmasligi kerak
        cookie: {
          maxAge: 1000 * 3600 * 6, // 6h sessionlar qancha vaqt amal qilishini anglatadi
        },
        store: store,
        resave: true,     // true: 10:30 auth => 16:30 agar 12:00da kirsak o'zini yangilaydi oxirgi kirganidan hisoblab o'chiradi. // false bo'lsa  3 soat orasda kirsaham o'sha vaqtda o'chadi
        saveUninitialized: true
    })
);

/** 3-VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);   // SSR: EJS    Middleware Design Pattern
app.use("/", router);             // SPA: REACT.      


export default app; 