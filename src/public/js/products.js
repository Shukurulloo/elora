console.log("Products frontend javascript file");
//documentRedy internet sekn bo'lsa to'liq ochilguncha ishlamay turadi
$(function () { //productTyoesini drink qilsak dishVolumedan drinkVolumega o'zgaradi
    $(".product-collection").on("change", () => { //qo'lga olamz, change  bo'lganda err function ishga tushadi
        const selectedValue = $(".product-collection").val(); // qo'lga olamz
        if(selectedValue === "DRINK") { // agar slval drink b o'lsa
            $("#product-collection").hide(); // DISHni yashiradi
            $("#product-volume").show(); // 1.2 litrni ko'rsatadi
        } else { // aks holda teskarisi
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });
// bu mantiq new Product buttoni bosilganda new product detail ko'rinsini un
    $("#process-btn").on("click", () => { //process-btn qo'lga olb u bosilganda erFunction ishga tushadi
        $(".dish-container").slideToggle(500); // 5 sekun ko'rsatib keyin joyiga qaytsin
        $("#process-btn").css("display", "none"); // display ko'rinmasin
    });

// bu mantiq cancel bosilganga  joyiga qaytshi hide bo'lsh uchn
    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(100); // 1 sekunda joyiga qaytsin
        $("#process-btn").css("display", "flex"); // display ko'rinsin
    });

// bu update qilish mantig'i, statusini o'zgartirish
    $(".new-product-status").on("change", async function(e) { // o'zgarish bo'lganda
        const id = e.target.id; // event, targetni icidagi idni olamz
        const productStatus = $(`#${id}.new-product-status`).val(); //o'zgarishi kerak bo'lgan id valusi qabul qlamz

        try { // Headerdagi axiosni posti ni idni qo'yamz  2-argumentda faqat productStatus o'zgarishi kerak uni tenglab databacega yuboramz
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
            console.log("response", response);                         //2-argumentda faqat productStatus o'zgarishi kerak uni productStatusga tenglab
            const result = response.data; // axiosni responsidan kelayotgan datani resultga tenglab
            if(result.data) { // datani ichida backentdan yuborgan datamiz bo'lsa
                $(".new-product-status").blur(); // o'zgarganni blur qilamz yani ko'rinishiham o'zgartiramz
            } else alert("Product update failed!");
        } catch(err) {
            console.log(err);
            alert("Product update failed!");
        }
    });

});

// validation
function validateForm() {
    const productName = $(".product-name").val(); // memberNickni qabul qilamz id bo'lsa #
    const productPrice = $(".product-price").val(); 
    const productLeftCount = $(".product-left-count").val(); 
    const productCollection = $(".product-collection").val(); 
    const productDesc = $(".product-desc").val(); 
    const productStatus = $(".product-status").val(); 

// agar bo'sh string bo'lsa databacega yubormasin hato bo'lsa alartni ko'rstadi
    if(
        productName === "" || 
        productPrice === "" || 
        productLeftCount === "" || 
        productCollection === "" || 
        productDesc === "" || 
        productStatus === ""
        ) {
        alert("Please insert all details!");
        return false; // BackEndga otkazmay turadi
    } else return true; // boshqa holda yuborsin
}
// multyUsich funct, yuklanadigon fileni oldindan ko'rish mantig'i buni ejsni imgni ostidagi inputdagi onchaneda ishlatamz
function previewFileHandler(input, order) { // order aynan qaysi mantiqda preview qilyatganimiz 5ta img
    const imgClassName = input.className; // inputdan imgni clas namesini qabul qilamz
    console.log("input:", input)
    // imgni qabul qilamz
    const file = $(`.${imgClassName}`).get(0).files[0]; // yuqoridagi imgni ichidagi 0-indexdagi file olib ber
    const fileType = file["type"]; // file typeni ejsdan olamz
    const validImageType = ["image/jpg", "image/jpeg", "image/png"]; // ruhsat etilgan

    if(!validImageType.includes(fileType)) { //agar boshqa file kiritilsa
        alert(" Please insert only jpeg, jpg, png!")
    } else {  //aks holda
      if(file) {
        const reader = new FileReader(); // FileReader fayllarni o'qish uchun 
        reader.onload = function() { // Fayl o'qilib function ishga tushdi
            $(`#image-section-${order}`).attr("src", reader.result); //qayerga prerender qilishni ko'rsatadi
        };                 //orderga tenglab uni atrubitini ichidagi srcni qiymatini o'zgartiramz readerni resultiga
        reader.readAsDataURL(file);//Data URL ko'rinishida o'qib beradi
       }
    }
}