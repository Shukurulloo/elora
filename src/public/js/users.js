console.log("Users frontend javascript file");

$(function () {
    $(".member-status").on("change", function(e) {
        const id = e.target.id,  // event, targetni icidagi idni olamz
            memberStatus = $(`#${id}.member-status`).val();

        // TODO: Axios updateChosenUser restAPI
        axios.post("/admin/user/edit", {  // Headerdagi axiosni posti ni idni qo'yamz  
            _id: id, 
        memberStatus: memberStatus,  //2-argumentda faqat productStatus o'zgarishi kerak uni tenglab databacega yuboramz
        }).then((response) => {
            console.log("response:", response);
            const result = response.data;  // axiosni responsidan kelayotgan datani resultga tenglab

            if(result.data) { // datani ichida backentdan yuborgan datamiz bo'lsa
                $(".member-status").blur(); // o'zgarganni blur qilamz yani ko'rinishiham o'zgartiramz
            } else alert("User update failed!");
        }).catch((err) => {
            console.log(err);
            alert("User update failed!");
        });
    });
});