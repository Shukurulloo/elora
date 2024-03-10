export enum HttpCode {   //HttpCode codeproperty
    OK = 200,                      // So'rov muvaffaqiyatli bajarildi va natijalar qaytarildi.            
    CREATED = 201,                 // So'rov muvaffaqiyatli bajarildi va yangi resurs yaratildi.
    NOT_MODIFIED = 304,            // Agar serverda ma'lumot o'zgartirilmagan bo'lasa va yangilanmagan bo'lsa chiqadi.
    BAD_REQUEST = 400,             // So'rovda xato bo'limlar mavjud bo'lsa.
    UNAUTHORIZED = 401,            // Foydalanuvchi autentifikatsiya(hafszlik)dan o'tmadi.
    FORBIDDEN = 403,               // So'rov amalga oshirish uchun ruxsat yo'q.
    NOT_FOUND = 404,               // So'ralgan resurs(data) topilmadi yoki mavjud emas.
    INTERNAL_SERVER_ERROR = 500,   // Serverda noaniqlik yuz berdi va so'rovni bajarib bo'lmaydi.
}

export enum Message {
    SOMETHING_WENT_WRONG = "Something went wrong!",      // Noto'g'ri narsa sodir bo'ldi.
    NO_DATA_FOUND = "No data is found!",                 // Data topilmadi.
    CREATE_FAILED = " Create is failed!",                // Yangi ma'lumot qo'shilmadi.
    UPDATE_FAILED = "Update is failed!",                 // Malumot yangilashda xatolik yuzaga keldi.

    USED_NICK_PHONE = "You are inserting alredy used nick or phone!",
    NO_MEMBER_NICK = "No member with that member nick!",
    WRONG_PASSWORD = "Wrong password, please try again!",
    NOT_AUTHENTICATED = "You are not authenticated, Plase login first!"
}

class Errors extends Error {           // customized class (inheritance)
    public code: HttpCode;              // static property
    public message: Message;

    static standard = {                 // general errors
        code: HttpCode.INTERNAL_SERVER_ERROR,
        Message: Message.SOMETHING_WENT_WRONG
    }

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();                        //  class o'zgaruvchilariga murojaat qilish va ularni boshqarishda ishlatiladi(malumot yuborish)
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors;