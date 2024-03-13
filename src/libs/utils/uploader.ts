import path from "path";
import multer from "multer";
import { v4 } from 'uuid';

/** MULTER IMAGE UPLOADER  */
function getTargetImageStorage(address: any) { 
    return multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, `./uploads/${address}`);
    },
    filename: function (req, file, cb){
        const extension = path.parse(file.originalname).ext;
        const random_name = v4() + extension;
        cb(null, random_name);
    },
    });
}

const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address);
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
