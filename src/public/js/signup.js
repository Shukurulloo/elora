console.log("Signup frontend javascript file");
// Document Ready jarayoni qisqa variani $ bu jQueri belgisi
$(function () { //prevender mantig'i
    const fileTarget = $(".file-box .upload-hidden");
    let filename;

    fileTarget.on("change", function () {
    if(window.FileReader) {
        const uploadFile = $(this)[0].files[0],
            fileType = uploadFile["type"], // Tanlangan faylning turi aniqlanadi.
            validImageType = ["image/jpg", "image/jpeg", "image/png"]; // main type
        if(!validImageType.includes(fileType)) {
            alert(" Please insert only jpeg, jpg, png!")
        } else { 
            if(uploadFile) {
                console.log(URL.createObjectURL(uploadFile));
                $(".upload-img-frame")
                    .attr("src", URL.createObjectURL(uploadFile))
                    .addClass("success")   
            }
            filename = $(this)[0].files[0].name;
        }
        $(this).siblings(".upload-name").val(filename); // defoult rasmni member rasmga almashtirish
     }
    });
});

function validateSignupForm() {
    const memberNick = $(".member-nick").val(), // memberNickni qabul qilamz id bo'lsa #
        memberPhone = $(".member-phone").val(),
        memberPassword = $(".member-password").val(),
        confirmPassword = $(".confirm-password").val();

    if(
        memberNick === "" || // agar bo'sh string bo'lsa databacega yubormasin hato bo'lsa alartni ko'rstadi
        memberPhone === "" || 
        memberPassword === "" || 
        confirmPassword === ""
    ){
        alert("Please insert all required inputs!");
        return false; // BackEndga otkazmay turadi
        }

    if (memberPassword !== confirmPassword) {
        alert("Password differs, please check!")
        return false;
    }

    const memberImage = $(".member-image").get(0).files[0] 
    ? $(".member-image").get(0).files[0].name 
    : null;
    if(!memberImage) {
        alert("Please insert restaurant image!");
        return false;
    }
}