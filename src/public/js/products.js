console.log("Products frontend javascript file");

$(function () { //productTyoesini drink qilsak dishvolumedan drinkVolumega o'zgaradi
    $(".product-collection").on("change", () => {
        const selectedValue = $(".product-collection").val();
        if(selectedValue === "DRINK") {
            $("#product-collection").hide();
            $("#product-volume").show();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });
// bu mantiq new Product buttoni bosilganda new product detail ko'rinsini un
    $("#process-btn").on("click", () => {
        $(".dish-container").slideToggle(500); // 5 sekunda joyiga qaytsin
        $("#process-btn").css("display", "none");
    });

// bu mantiq cancel bosilganga  joyiga qaytshi hide bo'lsh uchn
    $("#cancel-btn").on("click", () => {
        $(".dish-container").slideToggle(100); // 1 sekunda joyiga qaytsin
        $("#process-btn").css("display", "flex");
    });

// bu update qilish mantig'i
    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id;
        const productStatus = $(`#${id}.new-product-status`).val();
        console.log("id:", id);
        console.log("productStatus:", productStatus);

        try {
            const response = await axios.post(`/admin/product/${id}`, {productStatus: productStatus});
            console.log("response", response);
            const result = response.data;
            if(result.data) {
                console.log("Product updated!");
                $(".new-product-status").blur();
            } else alert("Product update failed!");
        } catch(err) {
            console.log(err);
            alert("Product update failed!");
        }
    });

});


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
    } else return true;
}

function previewFileHandler(input, order) {
    const imgClassName = input.className;
    console.log("input:", input)
    
    const file = $(`.${imgClassName}`).get(0).files[0];
    const fileType = file["type"];
    const validImageType = ["image/jpg", "image/jpeg", "image/png"]; 

    if(!validImageType.includes(fileType)) {
        alert(" Please insert only jpeg, jpg, png!")
    } else {
      if(file) {
        const reader = new FileReader();
        reader.onload = function() {
            $(`#image-section-${order}`).attr("src", reader.result);
        };
        reader.readAsDataURL(file);
       }
    }
}