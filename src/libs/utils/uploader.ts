// rasmni serverga yuklash mantig'i (himoya uchun) uploader MVC ga kirmaydi alohida
import path from "path";
import multer from "multer";
import { v4 } from 'uuid';  //random string qabul qilsh uchun

/** MULTER IMAGE UPLOADER  hammasi uchun */
function getTargetImageStorage(address: any) {  
    return multer.diskStorage({ // multerni ichidan diskStorageni qabul qilamz va kirib bkelayotgan faylni qayerga yuklash kerakligi takidlaymiz
    destination: function ( req, file, cb) {  // diskStorageni ichiga optionlarni qabul qilkdik
        cb(null, `./uploads/${address}`); // shu yerga yuklaymiz
    },
    filename: function (req, file, cb){ // fileni yuklab bo'lgach
        const extension = path.parse(file.originalname).ext; // path ni parse methodini yozsak turli xil comandalarni oshirish imkonini beradi
        const random_name = v4() + extension; // v4 random raqamlarni hosil qilib beradigon instrument // extension ni .jpg kabi formatini biriktiramz
        cb(null, random_name);  // yuklanishi kerak bo'lgan fileni nomi
    },
    });
}

const makeUploader = (address: string) => { // qayerga yuklanishi shuyerga pass qilish kerak
    const storage = getTargetImageStorage(address); //aynan shu manzilga yuklab bersin
    return multer({ storage: storage}); 
};

export default makeUploader;


/*
// faqat img uchun
const product_storage = multer.diskStorage({ //kirib bkelayotgan faylni qayerga yuklash kerakligi takidlaymiz
    destination: function (req, file, cb) {
    cb(null, './uploads/products');
},
filename: function (req, file, cb) {  //yuklab bo'lgach
    console.log(file); // yuklanayotgan fileni parametrlari
    const extension = path.parse(file.originalname).ext; // path : originalnameni fileni ichidan olamz
    const random_name = v4() + extension; // v4 random raqamlarni hosil qilib beradigon instrument // extension ni .jpg kabi formati
    cb(null, random_name); // fileni nomi
},
});

export const uploadProductImage = multer({ storage: product_storage });
*/
